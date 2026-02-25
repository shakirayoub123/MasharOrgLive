const adminProtect = require("../middleware/adminAuth");
const { logActivity } = require("../utils/logger");
const Alumni = require("../models/Alumni");
const express = require("express");
const router = express.Router();

// GET /api/v1/chat/history/:alumniId
// Fetch chat history for a specific alumni
router.get("/history/:alumniId", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({ alumniId: req.params.alumniId });
        if (!conversation) return res.json({ messages: [], conversationId: null, unreadCount: 0 });

        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
        res.json({
            messages,
            conversationId: conversation._id,
            unreadCount: conversation.unreadCount.alumni
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET /api/v1/chat/conversations
// Admin only: Get all active support threads with alumni details
router.get("/conversations", adminProtect, async (req, res) => {
    try {
        const conversations = await Conversation.find()
            .populate("alumniId", "name email batch")
            .sort({ updatedAt: -1 });
        res.json({ conversations });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST /api/v1/chat/message
// Save a new message to the database
router.post("/message", async (req, res) => {
    try {
        const { alumniId, text, senderModel, senderId } = req.body;

        if (!alumniId || !text || !senderModel || !senderId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let conversation = await Conversation.findOne({ alumniId });
        if (!conversation) {
            conversation = new Conversation({ alumniId });
        }

        const message = new Message({
            conversationId: conversation._id,
            senderId,
            senderModel,
            text
        });

        await message.save();

        // Update conversation metadata
        conversation.lastMessage = {
            text,
            sender: senderModel,
            createdAt: message.createdAt
        };

        if (senderModel === "Alumni") {
            conversation.unreadCount.admin += 1;

            // LOG ACTIVITY for alumni messages
            const alumni = await Alumni.findById(alumniId);
            await logActivity({
                type: "support_message",
                title: "New Support Message",
                description: `${alumni?.name || 'An alumni'} sent a new support message`,
                relatedAlumni: alumniId,
                metadata: { text: text.substring(0, 50) + (text.length > 50 ? "..." : "") }
            });
        } else {
            conversation.unreadCount.alumni += 1;
        }

        await conversation.save();

        res.json({ message, conversationId: conversation._id });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT /api/v1/chat/read/:alumniId
// Mark a conversation as read (reset unread count for the requester)
router.put("/read/:alumniId", async (req, res) => {
    try {
        const { role } = req.body; // 'Alumni' or 'Admin'
        const conversation = await Conversation.findOne({ alumniId: req.params.alumniId });

        if (conversation) {
            if (role === "Admin") {
                conversation.unreadCount.admin = 0;
            } else {
                conversation.unreadCount.alumni = 0;
            }
            await conversation.save();
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
