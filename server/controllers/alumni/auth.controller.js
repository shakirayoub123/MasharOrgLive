const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const BaseController = require("../base.controller");
const Alumni = require("../../models/Alumni");
const Admin = require("../../models/Admin");

const { generateRandomString, generateToken } = require("../../helpers");

const { mailer } = require("../../events/notifier")
// ─── MULTER SETUP ─────────────────────────────────────────────────────────────
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "../../uploads/avatars");
        // Create folder if it doesn't exist
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${req.user._id || req.user.id}${ext}`);
    },
});

const avatarFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, or WEBP images are allowed"), false);
};

// Export this middleware — apply it on the route before the controller
const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: avatarFilter,
}).single("avatar");

// ─── CONTROLLER ───────────────────────────────────────────────────────────────
class AuthController extends BaseController {

    info = (req, res) => {
        return this.success(res, "Authenticated Via JWT", req.user);
    };

    register = async (req, res) => {
        try {
            const { full_name, email, phone, country, course, completion_year, completion_status, website } = req.body;

            // 1. Honeypot Check
            if (website) {
                // Silently reject bots by returning success
                return this.success(res, "Registration submitted successfully! You will receive an email once approved.", {});
            }

            if (!full_name || !email) {
                return this.error(res, "Name and email are required", 400);
            }

            // 2. Name Heuristics Check (5+ consecutive consonants)
            if (/(?![aeiouy])[a-z]{5,}/i.test(full_name)) {
                return this.success(res, "Registration submitted successfully! You will receive an email once approved.", {});
            }

            // 4. Email Heuristics Check
            const isDisposable = require("is-disposable-email");
            if (isDisposable(email)) {
                return this.error(res, "Please use a valid, non-disposable email address.", 400);
            }

            // Block Gmail dot trick (more than 2 dots in local part)
            if (email.toLowerCase().endsWith("@gmail.com")) {
                const localPart = email.split("@")[0];
                const dotCount = (localPart.match(/\./g) || []).length;
                if (dotCount > 2) {
                    return this.success(res, "Registration submitted successfully! You will receive an email once approved.", {});
                }
            }

            if (await Alumni.findOne({ email })) {
                return this.error(res, "Email already registered", 400);
            }

            await Alumni.create({
                full_name, email, phone, country, course, completion_year, completion_status,
                status: "pending", remember_token: generateRandomString(37, "_k3d_"),
            });

            this.dispatchNotifications(full_name, email, phone);

            return this.success(res, "Registration submitted successfully! You will receive an email once approved.", {});

        } catch (error) {
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map(e => e.message);
                return this.error(res, messages.join(", "), 400);
            }
            return this.error(res, "Server error", 500);
        }
    };

    dispatchNotifications(name, email, phone) {
        mailer.emit("sendEmail", {
            to: email,
            subject: "Your Mashar Alumni Application Has Been Received",
            templateName: "alumni_ack",
            data: { full_name: name },
        });

        const { getAdminEmails } = require("../../helpers");
        const adminEmails = getAdminEmails();
        
        // Send notification to all admin emails
        adminEmails.forEach(adminEmail => {
            mailer.emit("sendEmail", {
                to: adminEmail,
                subject: "Alumni Registered :: Approve/Reject",
                templateName: "alumni_approval",
                data: { full_name: name, email, phone },
            });
        });
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return this.error(res, "Please provide email and password");
            }

            const alumni = await Alumni.findOne({ email });

            if (!alumni) return this.error(res, "Invalid email or password");

            if (alumni.account_status === "pending") {
                return this.error(res, "Your account approval is pending yet. Please wait for admin confirmation.");
            }

            if (alumni.account_status === "rejected") {
                return this.error(res, "Your registration has been rejected. Please contact support.");
            }

            if (!alumni.password) {
                return this.error(res, "Please set your password using the link sent to your email.");
            }

            if (!(await alumni.comparePassword(password))) {
                return this.error(res, "Invalid email or password");
            }

            return this.success(res, "Login successful", {
                token: generateToken(alumni._id),
                alumni: {
                    id: alumni._id,
                    email: alumni.email,
                    name: alumni.full_name,
                    avatar: alumni.avatar || "",
                },
            });

        } catch (error) {
            return this.error(res, error.message);
        }
    };

    /**
     * ==========================================
     * UPDATE PROFILE  (handles avatar too)
     * ==========================================
     * POST /api/auth/profile
     * Accepts multipart/form-data
     *   - Profile fields (full_name, email, bio, …)
     *   - Optional file field: "avatar"
     *   - Optional flag:      "remove_avatar" = "true"
     *
     * Route must use uploadAvatar middleware:
     *   router.post("/auth/profile", protect, uploadAvatar, authController.updateProfile)
     */
    updateProfile = async (req, res) => {
        try {
            const alumniId = req.user._id || req.user.id;

            const {
                full_name, email, bio, city, country, phone,
                course, completion_year, languages, remove_avatar,
            } = req.body;

            if (!full_name || !email) {
                return this.error(res, "Full name and email are required", 400);
            }

            const existingAlumni = await Alumni.findById(alumniId);
            if (!existingAlumni) return this.error(res, "Alumni not found", 404);

            // Email uniqueness check
            if (existingAlumni.email !== email) {
                const emailExists = await Alumni.findOne({ email, _id: { $ne: alumniId } });
                if (emailExists) return this.error(res, "Email already in use", 400);
            }

            // ── Avatar handling ──────────────────────────────────────────────
            let avatarUpdate = {};

            if (req.file) {
                // New file uploaded — store relative URL
                avatarUpdate.avatar = `/uploads/avatars/${req.file.filename}`;

                // Delete old avatar file from disk if it exists
                if (existingAlumni.avatar) {
                    const oldPath = path.join(__dirname, "../../", existingAlumni.avatar);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            } else if (remove_avatar === "true") {
                // User explicitly removed their avatar
                avatarUpdate.avatar = "";

                if (existingAlumni.avatar) {
                    const oldPath = path.join(__dirname, "../../", existingAlumni.avatar);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
            }
            // ────────────────────────────────────────────────────────────────

            // Parse languages — frontend sends JSON.stringify(array)
            let parsedLanguages = [];
            try {
                parsedLanguages = languages ? JSON.parse(languages) : [];
            } catch {
                parsedLanguages = Array.isArray(languages) ? languages : [];
            }

            const updatedAlumni = await Alumni.findByIdAndUpdate(
                alumniId,
                {
                    full_name: full_name.trim(),
                    email: email.toLowerCase().trim(),
                    bio: bio || "",
                    city: city || "",
                    phone: phone || "",
                    country: country || "",
                    course: course || "",
                    completion_year: completion_year || "",
                    languages: parsedLanguages,
                    ...avatarUpdate,          // only set if avatar changed
                },
                { new: true, runValidators: true }
            );

            if (!updatedAlumni) return this.error(res, "Failed to update profile", 500);

            return this.success(res, "Profile updated successfully", updatedAlumni);

        } catch (error) {
            console.error("Update profile error:", error);
            return this.error(res, error.message || "Failed to update profile", 500);
        }
    };

    getProfile = async (req, res) => {
        try {
            const alumniId = req.user._id || req.user.id;
            const alumni = await Alumni.findById(alumniId).select("-password -remember_token");
            if (!alumni) return this.error(res, "Alumni not found", 404);
            return this.success(res, "Profile fetched successfully", alumni);
        } catch (error) {
            return this.error(res, "Server error", 500);
        }
    };

    /**
     * ==========================================
     * CHANGE PASSWORD — AUTHENTICATED
     * ==========================================
     * POST /api/auth/password
     */
    changePassword = async (req, res) => {
        try {
            const alumniId = req.user._id || req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return this.error(res, "Current password and new password are required", 400);
            }

            if (newPassword.length < 6) {
                return this.error(res, "New password must be at least 6 characters", 400);
            }

            if (currentPassword === newPassword) {
                return this.error(res, "New password must be different from current password", 400);
            }

            const alumni = await Alumni.findById(alumniId);
            if (!alumni) return this.error(res, "Alumni not found", 404);

            if (!(await alumni.comparePassword(currentPassword))) {
                return this.error(res, "Current password is incorrect", 401);
            }

            alumni.password = newPassword;
            alumni.remember_token = generateRandomString(37, "x_msh_");
            await alumni.save();

            return this.success(res, "Password updated successfully", {});

        } catch (error) {
            console.error("Change password error:", error);
            return this.error(res, error.message || "Failed to change password", 500);
        }
    };

    /**
     * ==========================================
     * LEGACY PASSWORD CHANGE (token-based)
     * ==========================================
     */
    legacyChangePassword = async (req, res) => {
        try {
            const { token, new_password, old_password, password } = req.body;

            if (!token) return this.error(res, "Token is required");

            const alumni = await Alumni.findOne({ remember_token: token });
            if (!alumni) return this.error(res, "Invalid token or user not found");

            if (old_password && !(await alumni.comparePassword(old_password))) {
                return this.error(res, "Old password does not match");
            }

            alumni.password = new_password ?? password;
            alumni.remember_token = generateRandomString(37, "x_msh_");
            await alumni.save();

            return this.success(res, "Password updated successfully", {
                alumni: { id: alumni._id, name: alumni.full_name, email: alumni.email },
            });

        } catch (err) {
            console.error("Change password error:", err);
            return this.error(res, "Server error");
        }
    };

    initAdminLogin = async (req, res) => {
        const { email } = req.body;

        if (!email) return this.error(res, "Email is required");

        const admin = await Admin.findOne({ email });
        if (!admin) return this.error(res, "You are not authorized to login");

        const otp = crypto.randomInt(100000, 1000000);
        admin.otp = otp;
        admin.otpExpires = Date.now() + 5 * 60 * 1000;
        await admin.save();

        console.log(admin);

        mailer.emit("sendEmail", {
            to: email,
            subject: "One Time Password for Mashar Admin Login",
            templateName: "admin_otp",
            data: { full_name: admin.full_name, appName: process.env.APP_NAME, otp, expiry_minutes: 5 },
        });

        return this.success(res, "OTP sent successfully");
    };

    validateAdminOtp = async (req, res) => {
        const { email, otp } = req.body;

        if (!email || !otp) return this.error(res, "Email and OTP are required");

        const admin = await Admin.findOne({ email });
        if (!admin) return this.error(res, "You are not authorized to login");

        if (parseInt(admin.otp) !== parseInt(otp)) return this.error(res, "Invalid OTP entered");

        admin.otp = null;
        admin.otpExpires = null;
        await admin.save();

        const token = await admin.generateAuthToken();
        return this.success(res, "", { email: admin.email, name: admin.full_name, token });
    };

    updateAdminProfile = async (req, res) => {
        try {
            const adminId = req.user._id || req.user.id;
            const { name, email } = req.body;

            if (!name || !email) {
                return this.error(res, "Name and email are required", 400);
            }

            const existingAdmin = await Admin.findById(adminId);
            if (!existingAdmin) return this.error(res, "Admin not found", 404);

            if (existingAdmin.email !== email) {
                const emailExists = await Admin.findOne({ email, _id: { $ne: adminId } });
                if (emailExists) return this.error(res, "Email already in use", 400);
            }

            const updatedAdmin = await Admin.findByIdAndUpdate(
                adminId,
                {
                    full_name: name.trim(),
                    email: email.toLowerCase().trim(),
                },
                { new: true, runValidators: true }
            );

            if (!updatedAdmin) return this.error(res, "Failed to update profile", 500);

            return this.success(res, "Profile updated successfully", {
                id: updatedAdmin._id,
                name: updatedAdmin.full_name,
                email: updatedAdmin.email,
            });
        } catch (err) {
            console.error("Update admin profile error:", err);
            return this.error(res, err.message || "Failed to update admin profile", 500);
        }
    };

    recoverPassword = async (req, res) => {
        try {
            const { email } = req.body;

            if (!email) return this.error(res, "Email is required");

            const alumni = await Alumni.findOne({ email });

            if (!alumni) return this.success(res, "If the email exists, a reset link has been sent.");

            const resetToken = crypto.randomBytes(16).toString("hex");
            alumni.remember_token = resetToken;
            await alumni.save();

            const baseUrl = (req.get("origin") || process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
            const resetUrl = `${baseUrl}/set-password?token=${resetToken}`;

            mailer.emit("sendEmail", {
                to: alumni.email,
                subject: "Reset Your Mashar Account Password",
                templateName: "alumni_recover_password",
                data: { full_name: alumni.full_name, url: resetUrl },
            });

            return this.success(res, "If the email exists, a reset link has been sent.");

        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };
}

module.exports = new AuthController();

// Export multer middleware separately so the router can use it
module.exports.uploadAvatar = uploadAvatar;