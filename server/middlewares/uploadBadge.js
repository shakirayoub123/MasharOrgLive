const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create badges upload directory if it doesn't exist
const UPLOAD_DIR = path.join(__dirname, "../uploads/badges");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for badge uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: badge-timestamp-random.ext
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `badge-${uniqueSuffix}${ext}`);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp, svg)"));
    }
};

const uploadBadge = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = uploadBadge;