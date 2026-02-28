const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload directory exists
const UPLOAD_DIR = path.join(__dirname, "../uploads/programs");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const ext = path.extname(file.originalname).toLowerCase() || ".bin";
        cb(null, `program-${uniqueSuffix}${ext}`);
    },
});

// ─── File filter — PDFs and images allowed ────────────────────────────────────
function fileFilter(_req, file, cb) {
    const allowedMimes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and image files are allowed."), false);
    }
}

// ─── Export ───────────────────────────────────────────────────────────────────
const uploadProgram = multer({
    storage,
    // fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,   // 50 MB max per file
        files: 20,                     // up to 20 files per request
    },
});

module.exports = uploadProgram;