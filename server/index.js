const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoMemoryServer } = require("mongodb-memory-server");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const alumniRoutes = require("./routes/alumni");
const adminRoutes = require("./routes/admin");

const app = express();

// ── Middleware ──────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ─────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/alumni", alumniRoutes);
app.use("/api/v1/admin", adminRoutes);

// ── Health check ───────────────────────
app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/posts", require("./routes/posts"));

// ── Connect to MongoDB & Start Server ──
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        let mongoUri = process.env.MONGO_URI;

        // If no external MongoDB is available, use in-memory server
        if (!mongoUri || mongoUri.includes("localhost")) {
            console.log("⏳ Starting in-memory MongoDB server...");
            const mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            console.log("✅ In-memory MongoDB started");
        }

        await mongoose.connect(mongoUri);
        console.log("✅ MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server startup failed:", err.message);
        process.exit(1);
    }
}

startServer();
