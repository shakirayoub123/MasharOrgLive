// models/NotificationRead.js

const mongoose = require("mongoose");

const notificationReadSchema = new mongoose.Schema(
    {
        notification_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        read_at: {
            type: Date,
            default: new Date(),
        },
        cleared: {
            type: Boolean,
            default: false,
        },
        cleared_at: {
            type: Date,
            default: null,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("NotificationRead", notificationReadSchema);