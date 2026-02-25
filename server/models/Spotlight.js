const mongoose = require("mongoose");

const spotlightSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        initials: {
            type: String,
            required: [true, "Initials are required"],
            trim: true,
            maxlength: 2,
        },
        role: {
            type: String,
            trim: true,
            default: "",
        },
        location: {
            type: String,
            trim: true,
            default: "",
        },
        batch: {
            type: String,
            trim: true,
            default: "",
        },
        quote: {
            type: String,
            required: [true, "Quote is required"],
            trim: true,
        },
        gradientFrom: {
            type: String,
            default: "#C9A84C",
        },
        gradientTo: {
            type: String,
            default: "#2A6B7C",
        },
        active: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Spotlight", spotlightSchema);