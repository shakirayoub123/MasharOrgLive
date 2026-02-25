const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["registration", "approval", "rejection", "support_message", "admin_login", "system"],
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin", // Optional: links actions to specific admins
        },
        relatedAlumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni", // Optional: links to involved alumni
        },
        metadata: {
            type: Object, // Extra data like batch, email, etc.
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
