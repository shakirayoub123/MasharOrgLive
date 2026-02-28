const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        alumni_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true
        },

        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },

        lastMessage: {
            type: String,
            default: ""
        },

        lastMessageAt: {
            type: Date
        },

        unreadCount: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

// ✅ Correct unique conversation pair
conversationSchema.index({ alumni_id: 1, admin_id: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);