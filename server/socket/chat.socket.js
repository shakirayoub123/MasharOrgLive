module.exports = (io) => {

    io.on("connection", (socket) => {

        socket.on("joinConversation", (conversationId) => {
            console.log("joined conv " + conversationId)
            socket.join(conversationId);
        });

        socket.on("join_room", (roomId) => {
            if (roomId) {
                socket.join(roomId);
                console.log(`📌 Socket ${socket.id} joined personal room: ${roomId}`);
            }
        });

        socket.on("sendMessage", async (data) => {
            console.log("📥 Raw data:", JSON.stringify(data));
            try {
                const Message = require("../models/Message");
                const Conversation = require("../models/Conversation");

                const { conversationId, senderId, senderType, text } = data;
                console.log("📥 conversationId:", conversationId);

                const message = await Message.create({
                    conversation_id: conversationId,
                    sender_id: senderId,
                    sender_model: senderType === "admin" ? "Admin" : "Alumni",
                    message: text
                });
                console.log("💾 Message saved:", message._id);

                const conversation = await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: text,
                    lastMessageAt: new Date()
                });
                console.log("🗂️ Conversation updated:", conversation?._id);

                const payload = {
                    conversationId: conversationId,
                    text,
                    senderModel: senderType === "admin" ? "Admin" : "Alumni",
                    incoming: senderType === "admin",
                    sentAt: message.createdAt
                };
                console.log("📤 Payload:", JSON.stringify(payload));

                io.to(conversationId).emit("receiveMessage", payload);

                if (senderType === "alumni") {
                    console.log("📡 Emitting to admin_global");
                    io.to("admin_global").emit("receiveMessage", payload);
                }

            } catch (err) {
                console.error("❌ Socket error:", err.message, err.stack);
            }
        });

    });

};