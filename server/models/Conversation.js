const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        alumniId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true,
            unique: true, // Each alumni has one dedicated support thread with admins
        },
        lastMessage: {
            text: String,
            sender: { type: String, enum: ["Alumni", "Admin"] },
            createdAt: Date,
        },
        unreadCount: {
            alumni: { type: Number, default: 0 }, // Unread by alumni (sent by admin)
            admin: { type: Number, default: 0 },  // Unread by admin (sent by alumni)
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
