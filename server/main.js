const express = require("express");
const dns = require("dns");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const hpp = require("hpp");
const compression = require("compression");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const app = express();

// Optimize payloads with Gzip Compression
app.use(compression());

// 1. Set security HTTP headers using Helmet
app.use(helmet({
    contentSecurityPolicy: false, // Disabled to ensure inline scripts from React and external CDNs don't break
    crossOriginEmbedderPolicy: false, // Disabled to ensure embedded iframes (e.g. YouTube) work
    crossOriginResourcePolicy: false, // Disabled to allow Vite dev server mapping of images
}));

// 2. Enforce HTTPS in production environments behind a load balancer/reverse proxy
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.header('host')}${req.url}`);
        }
        next();
    });
}

app.use(require("./middlewares/cors"));

require("./events/notifier");

// 3. Body parser with payload limit (prevents denial of service via huge payloads)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 4. Prevent HTTP Parameter Pollution (removes duplicate query parameters)
app.use(hpp());

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