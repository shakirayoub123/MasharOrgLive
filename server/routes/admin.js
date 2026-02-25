const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Alumni = require("../models/Alumni");
const Admin = require("../models/Admin");
const adminProtect = require("../middleware/adminAuth");

const router = express.Router();

// ── Email transporter setup ─────────────
const createTransporter = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false // Helps with self-signed certs in local dev
            }
        });
    }
    console.log("⚠️ SMTP not configured. Falling back to console logging for codes/links.");
    return null;
};

// ── Admin Auth Routes ─────────────────────

// POST /api/v1/admin/request-otp
router.post("/request-otp", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        let admin = await Admin.findOne({ email });
        if (!admin) {
            // For first-time setup or if explicitly allowed, create admin
            // In a production app, you might want to seed this instead
            admin = new Admin({ email });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        admin.otp = otp;
        admin.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await admin.save();

        const transporter = createTransporter();
        if (transporter) {
            await transporter.sendMail({
                from: `"Mashar Admin" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Your Admin Login OTP",
                html: `<h1>Admin Login</h1><p>Your OTP for Mashar Admin Dashboard is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
            });
            res.json({ message: "OTP sent to your email" });
        } else {
            console.log(`\n${"═".repeat(60)}`);
            console.log(`🔑 ADMIN LOGIN OTP: ${otp}`);
            console.log(`   Admin: ${email}`);
            console.log(`${"═".repeat(60)}\n`);
            res.json({ message: "SMTP not configured. OTP printed to console.", otp }); // Sending OTP in response ONLY for dev convenience if requested, usually strictly console.
        }
    } catch (error) {
        res.status(500).json({ message: "Error requesting OTP", error: error.message });
    }
});

// POST /api/v1/admin/verify-otp
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const admin = await Admin.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!admin) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        admin.otp = undefined;
        admin.otpExpires = undefined;
        await admin.save();

        const token = admin.generateAuthToken();
        res.json({ token, admin: { id: admin._id, email: admin.email } });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
});

// GET /api/v1/admin/me
router.get("/me", adminProtect, async (req, res) => {
    res.json({ admin: { id: req.admin._id, email: req.admin.email } });
});


// ── Alumni Management (Protected) ─────────

// ── Generate token and save to alumni ────
const generateAndSaveToken = async (alumni) => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    alumni.setPasswordToken = hashedToken;
    alumni.setPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await alumni.save();

    return rawToken;
};

// ── Send set-password email ─────────────
const sendSetPasswordEmail = async (email, name, token) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/set-password?token=${token}`;

    const transporter = createTransporter();

    if (transporter) {
        try {
            console.log(`⏳ Sending email to ${email}...`);
            await transporter.sendMail({
                from: `"Mashar Alumni" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Your Mashar Alumni Account Has Been Approved – Set Your Password",
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #0F1C80; padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Mashar Alumni!</h1>
                        </div>
                        <div style="padding: 30px; background: #f9f9f9;">
                            <p style="font-size: 16px; color: #333;">Hello <strong>${name}</strong>,</p>
                            <p style="font-size: 16px; color: #333;">Great news! Your alumni registration has been <strong>approved</strong>.</p>
                            <p style="font-size: 16px; color: #333;">Please click the button below to set your password and access your alumni dashboard:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetLink}" style="background: #0F1C80; color: white; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-size: 18px; display: inline-block;">Set Your Password</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">This link will expire in <strong>24 hours</strong>.</p>
                            <p style="font-size: 14px; color: #666;">If you did not register for Mashar Alumni, please ignore this email.</p>
                        </div>
                    </div>
                `,
            });
            console.log(`✅ Set-password email successfully sent to ${email}`);
            return { sent: true };
        } catch (error) {
            console.error(`❌ FAILED to send email to ${email}:`, error.message);
            console.log(`\n${"═".repeat(60)}`);
            console.log(`📧 SET PASSWORD LINK (Email failed)`);
            console.log(`   Alumni: ${name} (${email})`);
            console.log(`   Link:   ${resetLink}`);
            console.log(`${"═".repeat(60)}\n`);
            return { sent: false, link: resetLink, error: error.message };
        }
    } else {
        console.log(`\n${"═".repeat(60)}`);
        console.log(`📧 SET PASSWORD LINK (SMTP not configured)`);
        console.log(`   Alumni: ${name} (${email})`);
        console.log(`   Link:   ${resetLink}`);
        console.log(`${"═".repeat(60)}\n`);
        return { sent: false, link: resetLink };
    }
};

// GET /api/v1/admin/alumni/pending
router.get("/alumni/pending", adminProtect, async (req, res) => {
    try {
        const pendingAlumni = await Alumni.find({ status: "pending" })
            .select("-password -setPasswordToken -setPasswordExpires")
            .sort({ createdAt: -1 });

        res.json({ alumni: pendingAlumni });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/v1/admin/alumni/all
router.get("/alumni/all", adminProtect, async (req, res) => {
    try {
        const allAlumni = await Alumni.find()
            .select("-password -setPasswordToken -setPasswordExpires")
            .sort({ createdAt: -1 });

        res.json({ alumni: allAlumni });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /api/v1/admin/alumni/:id/approve
router.put("/alumni/:id/approve", adminProtect, async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }

        const rawToken = await generateAndSaveToken(alumni);
        alumni.status = "approved";
        await alumni.save();

        const emailResult = await sendSetPasswordEmail(alumni.email, alumni.name, rawToken);

        const response = {
            message: `Alumni "${alumni.name}" approved successfully. Set-password email sent.`,
        };

        if (!emailResult.sent) {
            response.setPasswordLink = emailResult.link;
            response.message = `Alumni "${alumni.name}" approved. SMTP not configured — use the link below to set password.`;
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /api/v1/admin/alumni/:id/resend
router.put("/alumni/:id/resend", adminProtect, async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }

        if (alumni.status !== "approved") {
            return res.status(400).json({ message: "Alumni must be approved first." });
        }

        if (alumni.password) {
            return res.status(400).json({ message: "Alumni has already set their password." });
        }

        const rawToken = await generateAndSaveToken(alumni);
        const emailResult = await sendSetPasswordEmail(alumni.email, alumni.name, rawToken);

        const response = {
            message: `Set-password link resent to "${alumni.name}".`,
        };

        if (!emailResult.sent) {
            response.setPasswordLink = emailResult.link;
            response.message = `New link generated for "${alumni.name}". SMTP not configured — use the link below.`;
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /api/v1/admin/alumni/:id/reject
router.put("/alumni/:id/reject", adminProtect, async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }

        alumni.status = "rejected";
        alumni.setPasswordToken = undefined;
        alumni.setPasswordExpires = undefined;
        await alumni.save();

        res.json({
            message: `Alumni "${alumni.name}" has been rejected.`,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
