const BaseController = require("../base.controller");
const Conversation = require("../../models/Conversation");
const Admin = require("../../models/Admin")
const Alumni = require("../../models/Alumni")
const Message = require("../../models/Message")

class AdminChatController extends BaseController {

    constructor() {
        super();
    }

    /**
     * Load all conversations for Admin
     * Includes alumni info + last message + online status
     */

    async getAllConversations(req, res) {
        try {

            const admin = req.user;

            const { page = 1, limit = 20 } = req.query;

            const conversations = await Conversation.find({
                admin_id: admin._id
            })
                .populate("alumni_id", "full_name email isOnline")
                .sort({ lastMessageAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const formatted = conversations
                .filter(conv => conv.alumni_id) // Filter out conversations with null alumni_id
                .map(conv => ({
                    _id: conv._id,

                    alumni: {
                        _id: conv.alumni_id._id,
                        name: conv.alumni_id.full_name,
                        email: conv.alumni_id.email
                    },

                    isOnline: conv.alumni_id.isOnline || false,

                    lastMessage: {
                        text: conv.lastMessage,
                        sender: "Alumni", // optional if you track sender
                        createdAt: conv.lastMessageAt
                    },

                    updatedAt: conv.updatedAt,
                    unreadCount: conv.unreadCount
                }));

            return this.success(res, "Conversations loaded", {
                conversations: formatted
            });

        } catch (err) {
            console.error(err);
            return this.error(res, "Failed to load conversations", 500);
        }
    }
    /**
     * Alumni starts chat with Admin
     */
    startConversation = async (req, res) => {
        try {

            const admin = req.user;

            if (!admin) {
                return this.error(res, "Admin not found", 404);
            }

            const adminId = admin._id;
            const { alumniId } = req.params;

            if (!alumniId) {
                return this.error(res, "Alumni ID is required", 400);
            }

            // Check if conversation already exists
            let conversation = await Conversation.findOne({
                alumni_id: alumniId,
                admin_id: adminId
            });

            // If not found → create
            if (!conversation) {
                conversation = await Conversation.create({
                    alumni_id: alumniId,
                    admin_id: adminId
                });
            }

            return this.success(
                res,
                "Conversation ready",
                {
                    conversationId: conversation._id
                },
                200
            );

        } catch (err) {
            console.error(err);
            return this.error(res, "Failed to start conversation", 500);
        }
    };

    loadConversation = async (req, res) => {
        try {

            const { conversationId } = req.params;

            const conversation_id = conversationId;

            if (!conversation_id) {
                return this.error(res, "Conversation ID is required", 400);
            }

            const conversation = await Conversation.findById(conversation_id);

            if (!conversation) {
                return this.error(res, "Conversation not found", 404);
            }


            // Load last 20 messages
            const messages = await Message.find({
                conversation_id : conversation_id
            })
                .sort({ createdAt: -1 })
                .limit(20);

            const formattedMessages = messages.reverse().map(msg => ({
                text: msg.message,
                incoming: msg.sender_model === "Alumni",
                sender: msg.sender_model,
                createdAt: msg.createdAt
            }));

            const alumni = await Alumni.findById(conversation.alumni_id)

            const response = {
                conversationId: conversation_id,
                alumni: alumni,
                messages: formattedMessages
            };

            return this.success(res, "Chat loaded successfully", response);

        } catch (err) {
            console.error(err);
            return this.error(res, "Failed to load chat", 500);
        }
    };
}

module.exports = new AdminChatController();