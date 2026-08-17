const express = require("express");
const dns = require("dns");
const path = require("path");
const fs = require("fs");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const app = express();

app.use(require("./middlewares/cors"));

require("./events/notifier");

app.use(express.json());

// Disable cache ONLY for API responses
app.use("/api", (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

// Upload folders
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.use(
    "/api/uploads",
    express.static(path.join(__dirname, "uploads"))
);

require("./routes/index")(app);

const distPath = path.join(__dirname, "../client/dist");

// Serve React build with proper caching
app.use(
    express.static(distPath, {
        etag: true,
        lastModified: true,
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, filePath) => {
            // index.html should not be cached
            if (filePath.endsWith("index.html")) {
                res.setHeader(
                    "Cache-Control",
                    "no-cache, no-store, must-revalidate"
                );
            }
        },
    })
);

// SPA Fallback
app.use((req, res, next) => {
    // Don't return index.html for missing assets
    if (
        req.originalUrl.startsWith("/assets/") ||
        /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|map|json)$/i.test(
            req.originalUrl
        )
    ) {
        return res.sendStatus(404);
    }

    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("API is running (No frontend build found context)");
    }
});

const { startServer } = require("./helpers");

startServer(app, process.env.APP_PORT ?? 5001);