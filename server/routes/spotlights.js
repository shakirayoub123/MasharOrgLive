const express = require("express");
const router = express.Router();
const Spotlight = require("../models/Spotlight");

// GET /api/v1/spotlights — active spotlights only (alumni-facing, no auth)
router.get("/", async (req, res) => {
    try {
        const spotlights = await Spotlight.find({ active: true }).sort({ createdAt: -1 });
        res.json({ success: true, spotlights });
    } catch (err) {
        console.error("GET /spotlights error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;