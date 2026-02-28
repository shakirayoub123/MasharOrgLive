const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        author: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        amazonLink: {
            type: String,
            required: true,
            trim: true,
        },
        cover_image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);