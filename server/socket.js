module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log("🔌 Socket connected:", socket.id);

        // Join a room — used for both conversation rooms and personal alumni rooms
        socket.on("join_room", (roomId) => {
            if (roomId) {
                socket.join(roomId);
                console.log(`📌 Socket ${socket.id} joined room: ${roomId}`);
            }
        });

        // Relay message to everyone in the conversation room except sender
        socket.on("send_message", (data) => {
            const { conversationId, alumniId } = data;

            if (conversationId) {
                // Broadcast to the conversation room
                socket.to(conversationId).emit("receive_message", data);
            }

            // Also emit to the alumni's personal room (for navbar badge)
            if (alumniId && data.senderModel === "Admin") {
                socket.to(alumniId).emit("receive_message", data);
            }

            // Also emit to a global "admin_room" so admin gets notified
            if (data.senderModel === "Alumni") {
                socket.to("admin_room").emit("receive_message", data);
            }
        });

        // Admin joins a global admin room for new-message notifications
        socket.on("join_admin", () => {
            socket.join("admin_room");
            console.log(`🛡️  Socket ${socket.id} joined admin_room`);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socket.id);
        });
    });
};
