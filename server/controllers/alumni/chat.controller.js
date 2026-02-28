const BaseController = require("../base.controller");
const Conversation = require("../../models/Conversation");
const Admin = require("../../models/Admin")
const Alumni = require("../../models/Alumni")
const Message = require("../../models/Message")
const { getAdminEmails } = require("../../helpers");

class AlumniChatController extends BaseController {

    constructor() {
        super();
    }

    loadConversation = async (req, res) => {
        try {
            const alumniId = req.user._id || req.user.id || req.user.userId;
            // ✅ Use helper function for admin emails
            const adminEmails = getAdminEmails();
            const admin = await Admin.findOne({
                email: { $in: adminEmails }
            });

            if (!admin) {
                return this.error(res, "Admin not found", 404);
            }

            let conversation = await Conversation.findOne({
                alumni_id: alumniId,
                admin_id: admin._id
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    alumni_id: alumniId,
                    admin_id: admin._id
                });
            }

            // 3️⃣ Load last 20 messages (latest first)
            const messagesList = await Message.find({ conversation_id: conversation.id })
                .sort({ createdAt: -1 })
                .limit(20);

            // 4️⃣ Format messages
            const formattedMessages = messagesList.reverse().map(msg => ({
                text: msg.message,
                incoming: msg.sender_model === "Admin",
                createdAt: msg.createdAt
            }));

            return this.success(res, "Chat loaded successfully", {
                conversation: conversation,
                messages: formattedMessages
            }, 200);

        } catch (err) {
            console.error(err);
            return this.error(res, "Failed to load chat", 500);
        }
    };
    getUnreadCount = async (req, res) => {
        try {
            const alumniId = req.user._id;

            // ✅ Use helper function for admin emails
            const adminEmails = getAdminEmails();
            const admin = await Admin.findOne({
                email: { $in: adminEmails }
            });

            if (!admin) {
                return this.success(res, "No admin configured", { unreadCount: 0, conversationId: null }, 200);
            }

            const conversation = await Conversation.findOne({
                alumni_id: alumniId,
                admin_id: admin._id
            });

            if (!conversation) {
                return this.success(res, "No conversation exists", { unreadCount: 0, conversationId: null }, 200);
            }

            return this.success(res, "Unread count loaded", {
                unreadCount: conversation.unreadCount?.alumni || 0,
                conversationId: conversation._id
            }, 200);

        } catch (err) {
            console.error(err);
            return this.error(res, "Failed to load unread count", 500);
        }
    };
}

module.exports = new AlumniChatController();