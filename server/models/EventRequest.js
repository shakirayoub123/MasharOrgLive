const mongoose = require("mongoose");

const EventRequestSchema = new mongoose.Schema(
    {
        // ── Alumni reference ─────────────────────────────────────────────────
        alumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true,
        },
        alumniName: { type: String, default: "" },
        alumniEmail: { type: String, default: "" },

        // ── Event info ───────────────────────────────────────────────────────
        eventTypeId: {
            type: String,
            enum: ["coach-to-coach", "hot-seat", "peer-coaching", "webinar"],
            required: true,
        },
        eventLabel: { type: String, default: "" },

        // ── Status ───────────────────────────────────────────────────────────
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        // ── Admin fields ─────────────────────────────────────────────────────
        adminNote: { type: String, default: "" },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
        reviewedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Indexes
EventRequestSchema.index({ alumni: 1, eventTypeId: 1 });   // duplicate check
EventRequestSchema.index({ status: 1, eventTypeId: 1 });   // admin filters
EventRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("EventRequest", EventRequestSchema);