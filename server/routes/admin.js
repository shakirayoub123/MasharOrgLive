const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Alumni = require("../models/Alumni");

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
    console.log("⚠️ SMTP not configured. Falling back to console logging for links.");
    return null;
};

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
            console.log(`⚠️ Falling back to console logging the link due to error.`);
            console.log(`\n${"═".repeat(60)}`);
            console.log(`📧 SET PASSWORD LINK (Email failed)`);
            console.log(`   Alumni: ${name} (${email})`);
            console.log(`   Link:   ${resetLink}`);
            console.log(`${"═".repeat(60)}\n`);
            return { sent: false, link: resetLink, error: error.message };
        }
    } else {
        // Fallback: log the link to console AND return it in response
        console.log(`\n${"═".repeat(60)}`);
        console.log(`📧 SET PASSWORD LINK (SMTP not configured)`);
        console.log(`   Alumni: ${name} (${email})`);
        console.log(`   Link:   ${resetLink}`);
        console.log(`${"═".repeat(60)}\n`);
        return { sent: false, link: resetLink };
    }
};

// ────────────────────────────────────────
// GET /api/v1/admin/alumni/pending
// List all pending alumni registrations
// ────────────────────────────────────────
router.get("/alumni/pending", async (req, res) => {
    try {
        const pendingAlumni = await Alumni.find({ status: "pending" })
            .select("-password -setPasswordToken -setPasswordExpires")
            .sort({ createdAt: -1 });

        res.json({ alumni: pendingAlumni });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ────────────────────────────────────────
// GET /api/v1/admin/alumni/all
// List all alumni registrations with their status
// ────────────────────────────────────────
router.get("/alumni/all", async (req, res) => {
    try {
        const allAlumni = await Alumni.find()
            .select("-password -setPasswordToken -setPasswordExpires")
            .sort({ createdAt: -1 });

        res.json({ alumni: allAlumni });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ────────────────────────────────────────
// PUT /api/v1/admin/alumni/:id/approve
// Approve an alumni and send set-password email
// ────────────────────────────────────────
router.put("/alumni/:id/approve", async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({ message: "Alumni not found" });
        }

        // Generate a set-password token
        const rawToken = await generateAndSaveToken(alumni);

        // Set status to approved
        alumni.status = "approved";
        await alumni.save();

        // Send email with raw token
        const emailResult = await sendSetPasswordEmail(alumni.email, alumni.name, rawToken);

        const response = {
            message: `Alumni "${alumni.name}" approved successfully. Set-password email sent.`,
        };

        // If SMTP not configured, include the link in the response so admin can share it
        if (!emailResult.sent) {
            response.setPasswordLink = emailResult.link;
            response.message = `Alumni "${alumni.name}" approved. SMTP not configured — use the link below to set password.`;
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ────────────────────────────────────────
// PUT /api/v1/admin/alumni/:id/resend
// Resend set-password link for an approved alumni
// ────────────────────────────────────────
router.put("/alumni/:id/resend", async (req, res) => {
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

        // Generate a fresh token
        const rawToken = await generateAndSaveToken(alumni);

        // Send email
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

// ────────────────────────────────────────
// PUT /api/v1/admin/alumni/:id/reject
// Reject an alumni registration
// ────────────────────────────────────────
router.put("/alumni/:id/reject", async (req, res) => {
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
