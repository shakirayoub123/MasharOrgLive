const mongoose = require("mongoose");

const spotlightSchema = new mongoose.Schema(
    {
        // ── Legacy fields (kept for backward compat) ──
        name: { type: String, trim: true, default: "" },
        initials: { type: String, trim: true, maxlength: 2, default: "" },
        role: { type: String, trim: true, default: "" },
        location: { type: String, trim: true, default: "" },
        batch: { type: String, trim: true, default: "" },
        gradientFrom: { type: String, default: "#C9A84C" },
        gradientTo: { type: String, default: "#2A6B7C" },

        // ── New announcement fields ──
        type: {
            type: String,
            enum: ["welcome", "certificate", "course", "achievement", "job", "graduation", "shoutout", "general"],
            default: "general"
        },
        title: { type: String, trim: true, default: "" },
        body: { type: String, trim: true, default: "" },
        quote: { type: String, trim: true, default: "" }, // kept for compat
        taggedAlumni: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alumni" }],
        status: { type: String, enum: ["published", "draft"], default: "published" },
        active: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Spotlight", spotlightSchema);