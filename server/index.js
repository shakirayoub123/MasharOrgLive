const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const alumniRoutes = require("./routes/alumni");
const adminRoutes = require("./routes/admin");
const spotlightRoutes = require("./routes/spotlights");
const adminSpotlightRoutes = require("./routes/adminSpotlights");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true }
});

// ── Middleware ──────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ─────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/alumni", alumniRoutes);

// ✅ Specific /admin/* routes BEFORE the generic /admin
app.use("/api/v1/spotlights", spotlightRoutes);
app.use("/api/v1/admin/spotlights", adminSpotlightRoutes);

// ✅ Generic admin route comes AFTER
app.use("/api/v1/admin", adminRoutes);

// ── Health check ───────────────────────
app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/posts", require("./routes/posts"));
app.use("/api/v1/chat", require("./routes/chat"));

// ── Socket.io Logic ───────────────────
io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`💬 User joined room: ${roomId}`);
    });

    socket.on("send_message", (data) => {
        // 1. Emit to the conversation room (for those currently in the chat window)
        io.to(data.conversationId).emit("receive_message", data);

        // 2. Emit to specific recipient room for Global Notifications (when chat is closed)
        if (data.senderModel === "Admin") {
            // To specific Alumni
            if (data.alumniId) io.to(data.alumniId).emit("receive_message", data);
        } else {
            // To all Admins
            io.to("admin_global").emit("receive_message", data);
        }
    });

    socket.on("disconnect", () => {
        console.log("👋 User disconnected");
    });
});

// ── Connect to MongoDB & Start Server ──
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        let mongoUri = process.env.MONGO_URI;

        if (!mongoUri || mongoUri.includes("localhost")) {
            console.log("⏳ Starting in-memory MongoDB server...");
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            console.log("✅ In-memory MongoDB started");
        }

        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB connected successfully");

        server.listen(PORT, () => {
            console.log(`🚀 Server + Socket running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server startup failed:", err.message);
        process.exit(1);
    }
}

startServer();