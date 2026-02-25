const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Alumni = require("../models/Alumni");

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ────────────────────────────────────────
// POST /api/v1/auth/register
// Alumni submits registration (no password)
// ────────────────────────────────────────
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, batch } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Check if alumni already exists
        const existing = await Alumni.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new alumni with status pending (no password)
        await Alumni.create({ name, email, phone, batch, status: "pending" });

        res.status(201).json({
            message: "Registration submitted successfully! You will receive an email once your account is approved.",
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ────────────────────────────────────────
// POST /api/v1/auth/login
// ────────────────────────────────────────
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Find alumni by email
        const alumni = await Alumni.findOne({ email });
        if (!alumni) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check approval status
        if (alumni.status === "pending") {
            return res.status(403).json({ message: "Your account is pending approval. Please wait for admin confirmation." });
        }
        if (alumni.status === "rejected") {
            return res.status(403).json({ message: "Your registration has been rejected. Please contact support." });
        }

        // Check if password has been set
        if (!alumni.password) {
            return res.status(403).json({ message: "Please set your password using the link sent to your email." });
        }

        // Check password
        const isMatch = await alumni.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            message: "Login successful",
            token: generateToken(alumni._id),
            alumni: {
                id: alumni._id,
                name: alumni.name,
                email: alumni.email,
                phone: alumni.phone,
                batch: alumni.batch,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ────────────────────────────────────────
// POST /api/v1/auth/set-password
// Alumni sets password using token from email
// ────────────────────────────────────────
router.post("/set-password", async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find alumni with valid token
        const alumni = await Alumni.findOne({
            setPasswordToken: hashedToken,
            setPasswordExpires: { $gt: Date.now() },
        });

        if (!alumni) {
            return res.status(400).json({ message: "Invalid or expired token. Please contact admin for a new link." });
        }

        // Set the password and clear token fields
        alumni.password = password;
        alumni.setPasswordToken = undefined;
        alumni.setPasswordExpires = undefined;
        await alumni.save();

        res.json({
            message: "Password set successfully!",
            token: generateToken(alumni._id),
            alumni: {
                id: alumni._id,
                name: alumni.name,
                email: alumni.email,
                phone: alumni.phone,
                batch: alumni.batch,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
