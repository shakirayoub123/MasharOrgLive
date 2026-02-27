const express = require("express");
const protect = require("../middleware/auth");
const Alumni = require("../models/Alumni");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

// GET /api/v1/alumni/me
router.get("/me", protect, async (req, res) => {
    const a = req.alumni;
    res.json({
        alumni: {
            id: a._id,
            name: a.name,
            email: a.email,
            phone: a.phone,
            batch: a.batch,
            bio: a.bio,
            city: a.city,
            country: a.country,
            linkedin: a.linkedin,
            website: a.website,
            coachingSpecialty: a.coachingSpecialty,
            certificationLevel: a.certificationLevel,
            graduationYear: a.graduationYear,
            languages: a.languages,
            availableForMentoring: a.availableForMentoring,
            openToCollaboration: a.openToCollaboration,
        },
    });
});

// PUT /api/v1/alumni/profile — update profile fields
router.put("/profile", protect, async (req, res) => {
    try {
        const allowed = [
            "name", "phone", "bio", "city", "country",
            "linkedin", "website", "coachingSpecialty",
            "certificationLevel", "graduationYear",
            "languages", "availableForMentoring", "openToCollaboration",
        ];

        const updates = {};
        allowed.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const alumni = await Alumni.findByIdAndUpdate(
            req.alumni._id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            message: "Profile updated",
            alumni: {
                id: alumni._id,
                name: alumni.name,
                email: alumni.email,
                phone: alumni.phone,
                batch: alumni.batch,
                bio: alumni.bio,
                city: alumni.city,
                country: alumni.country,
                linkedin: alumni.linkedin,
                website: alumni.website,
                coachingSpecialty: alumni.coachingSpecialty,
                certificationLevel: alumni.certificationLevel,
                graduationYear: alumni.graduationYear,
                languages: alumni.languages,
                availableForMentoring: alumni.availableForMentoring,
                openToCollaboration: alumni.openToCollaboration,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT /api/v1/alumni/password — change password
router.put("/password", protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const alumni = await Alumni.findById(req.alumni._id);

        const match = await alumni.comparePassword(currentPassword);
        if (!match) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        alumni.password = newPassword; // pre-save hook will hash it
        await alumni.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET /api/v1/alumni/notifications
router.get("/notifications", protect, async (req, res) => {
    try {
        const notifications = await ActivityLog.find({
            relatedAlumni: req.alumni._id,
            type: { $ne: "support_message" }
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
