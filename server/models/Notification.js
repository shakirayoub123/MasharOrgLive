// models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        action_link: {
            type: String,
            default: null,
        },
        notifiable_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        notifiable_type: {
            type: String,
            default: null, // e.g. "User", "Order", "Post"
        },
        
        channel: {
            type: String,
            enum: ["admin", "alumni"],
            default: "alumni",
        },
        read: {
            type: Boolean,
            default: false,
        },
        read_at: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);