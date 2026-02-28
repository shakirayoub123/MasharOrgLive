const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "cover_image") {
            cb(null, "uploads/images/");
        } else if (file.fieldname === "pdf_file") {
            cb(null, "uploads/pdfs/");
        } else if (file.fieldname === "image") {
            cb(null, "uploads/images/");  // ← post images go here
        } else {
            cb(new Error("Unknown field: " + file.fieldname), false);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// File validation
const fileFilter = (req, file, cb) => {
    if (
        file.fieldname === "cover_image" &&
        file.mimetype.startsWith("image/")
    ) {
        cb(null, true);
    } else if (
        file.fieldname === "pdf_file" &&
        file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    } else if (
        file.fieldname === "image" &&           // ← post image field
        file.mimetype.startsWith("image/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;