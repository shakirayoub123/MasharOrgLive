const Spotlight = require("../models/Spotlight");
const { notifyGlobally } = require("../events/notifier");

// GET /api/admin/spotlights
exports.getAllSpotlights = async (req, res) => {
    try {
        const spotlights = await Spotlight.find()
            .populate("taggedAlumni", "full_name email")
            .sort({ createdAt: -1 });

        const formatted = spotlights.map(s => ({
            ...s.toObject(),
            taggedAlumni: (s.taggedAlumni || []).map(a =>
                a._id
                    ? { id: a._id, name: a.full_name || a.name || "" }
                    : a
            )
        }));

        res.json({ success: true, spotlights: formatted });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/admin/spotlights
exports.createSpotlight = async (req, res) => {
    try {
        const {
            type, title, body, quote,
            taggedAlumni,
            status, active,
            name, initials, role, location, batch, gradientFrom, gradientTo
        } = req.body;

        if (!title && !name) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }
        if (!body && !quote) {
            return res.status(400).json({ success: false, message: "Message/quote is required" });
        }

        const spotlight = await Spotlight.create({
            type: type || "general",
            title: title || name || "",
            body: body || quote || "",
            quote: body || quote || "",
            taggedAlumni: taggedAlumni || [],
            status: status || "published",
            active: active !== undefined ? active : true,
            name: name || title || "",
            initials: initials || (name || title || "").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
            role, location, batch,
            gradientFrom: gradientFrom || "#C9A84C",
            gradientTo: gradientTo || "#2A6B7C",
            createdBy: req.admin?._id,
        });

        // ── Notify all alumni when spotlight is published ──────────────────
        if (spotlight.status === "published" && spotlight.active) {
            await notifyGlobally(
                `✨ New spotlight: ${spotlight.title}`,
                "/alumni/spotlight"
            );
        }

        res.status(201).json({ success: true, spotlight });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/admin/spotlights/:id
exports.updateSpotlight = async (req, res) => {
    try {
        const spotlight = await Spotlight.findById(req.params.id);
        if (!spotlight) return res.status(404).json({ success: false, message: "Spotlight not found" });

        const wasPublished = spotlight.status === "published" && spotlight.active;

        const {
            type, title, body, quote,
            taggedAlumni, status, active,
            name, initials, role, location, batch, gradientFrom, gradientTo
        } = req.body;

        if (type !== undefined) spotlight.type = type;
        if (title !== undefined) spotlight.title = title;
        if (body !== undefined) { spotlight.body = body; spotlight.quote = body; }
        if (quote !== undefined && !body) spotlight.quote = quote;
        if (taggedAlumni !== undefined) spotlight.taggedAlumni = taggedAlumni;
        if (status !== undefined) spotlight.status = status;
        if (active !== undefined) spotlight.active = active;
        if (name !== undefined) spotlight.name = name;
        if (initials !== undefined) spotlight.initials = initials;
        if (role !== undefined) spotlight.role = role;
        if (location !== undefined) spotlight.location = location;
        if (batch !== undefined) spotlight.batch = batch;
        if (gradientFrom !== undefined) spotlight.gradientFrom = gradientFrom;
        if (gradientTo !== undefined) spotlight.gradientTo = gradientTo;

        await spotlight.save();

        // ── Notify if a draft was just published ─────────────────────────
        // Only fires when transitioning from draft → published, not on every edit
        const isNowPublished = spotlight.status === "published" && spotlight.active;
        if (!wasPublished && isNowPublished) {
            notifyGlobally(
                `📢 New announcement: ${spotlight.title}`,
                "/alumni/spotlight"
            );
        }

        res.json({ success: true, spotlight });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/admin/spotlights/:id
exports.deleteSpotlight = async (req, res) => {
    try {
        const spotlight = await Spotlight.findById(req.params.id);
        if (!spotlight) return res.status(404).json({ success: false, message: "Spotlight not found" });

        await spotlight.deleteOne();
        res.json({ success: true, message: "Spotlight deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getActiveSpotlights = async (req, res) => {
    try {
        const spotlights = await Spotlight.find({ active: true, status: "published" })
            .sort({ createdAt: -1 });
        res.json({ success: true, spotlights });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};