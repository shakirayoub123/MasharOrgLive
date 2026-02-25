const express = require("express");
const router = express.Router();
const Spotlight = require("../models/Spotlight");
const adminAuth = require("../middleware/adminAuth");
const ActivityLog = require("../models/ActivityLog");

// GET /api/v1/admin/spotlights — all spotlights (including hidden)
router.get("/", adminAuth, async (req, res) => {
    try {
        const spotlights = await Spotlight.find().sort({ createdAt: -1 });
        res.json({ success: true, spotlights });
    } catch (err) {
        console.error("GET /admin/spotlights error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/v1/admin/spotlights — create
router.post("/", adminAuth, async (req, res) => {
    try {
        const { name, initials, role, location, batch, quote, gradientFrom, gradientTo, active } = req.body;

        if (!name || !quote) {
            return res.status(400).json({ success: false, message: "Name and quote are required" });
        }

        const spotlight = await Spotlight.create({
            name,
            initials: initials || name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
            role,
            location,
            batch,
            quote,
            gradientFrom: gradientFrom || "#C9A84C",
            gradientTo: gradientTo || "#2A6B7C",
            active: active !== undefined ? active : true,
            createdBy: req.admin?._id,
        });

        // Log activity separately — never block the main response
        try {
            await ActivityLog.create({
                type: "spotlight_created",
                title: "New Spotlight Added",
                description: `Admin added a spotlight for ${name}`,
                performedBy: req.admin?._id,
                onModel: "Admin",
            });
        } catch (logErr) {
            console.warn("ActivityLog failed (non-critical):", logErr.message);
        }

        res.status(201).json({ success: true, spotlight });
    } catch (err) {
        console.error("POST /admin/spotlights error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/v1/admin/spotlights/:id — update
router.put("/:id", adminAuth, async (req, res) => {
    try {
        const spotlight = await Spotlight.findById(req.params.id);
        if (!spotlight) {
            return res.status(404).json({ success: false, message: "Spotlight not found" });
        }

        const { name, initials, role, location, batch, quote, gradientFrom, gradientTo, active } = req.body;

        spotlight.name = name ?? spotlight.name;
        spotlight.initials = initials ?? spotlight.initials;
        spotlight.role = role ?? spotlight.role;
        spotlight.location = location ?? spotlight.location;
        spotlight.batch = batch ?? spotlight.batch;
        spotlight.quote = quote ?? spotlight.quote;
        spotlight.gradientFrom = gradientFrom ?? spotlight.gradientFrom;
        spotlight.gradientTo = gradientTo ?? spotlight.gradientTo;
        spotlight.active = active !== undefined ? active : spotlight.active;

        await spotlight.save();
        res.json({ success: true, spotlight });
    } catch (err) {
        console.error("PUT /admin/spotlights/:id error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/v1/admin/spotlights/:id — delete
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const spotlight = await Spotlight.findById(req.params.id);
        if (!spotlight) {
            return res.status(404).json({ success: false, message: "Spotlight not found" });
        }

        await spotlight.deleteOne();
        res.json({ success: true, message: "Spotlight deleted" });
    } catch (err) {
        console.error("DELETE /admin/spotlights/:id error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;