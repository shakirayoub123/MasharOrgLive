const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        cover_image: {
            type: String,
            required: true, // store file path or URL
        },
        heading: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        pdf_file: {
            type: String,
            required: true, // store file path or URL
        },
        featured: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt
    }
);

module.exports = mongoose.model("Article", articleSchema);