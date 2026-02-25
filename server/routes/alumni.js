const express = require("express");
const protect = require("../middleware/auth");

const router = express.Router();
// ──────────────────────────────────────── // GET /api/v1/alumni/me (Protected) 
// // Returns the authenticated alumni's profile

const ActivityLog = require("../models/ActivityLog");

// ... inside the file ...

router.get("/me", protect, async (req, res) => {
    res.json({
        alumni:
        {
            id: req.alumni._id,
            name: req.alumni.name,
            email: req.alumni.email,
            phone: req.alumni.phone,
            batch: req.alumni.batch,
        },
    });
});

// GET /api/v1/alumni/notifications
router.get("/notifications", protect, async (req, res) => {
    try {
        const notifications = await ActivityLog.find({
            relatedAlumni: req.alumni._id,
            type: { $ne: "support_message" } // Show system alerts only, chat has its own bubble
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
