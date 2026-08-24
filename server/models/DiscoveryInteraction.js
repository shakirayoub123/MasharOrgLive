const mongoose = require("mongoose");

const DiscoveryInteractionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        company: {
            type: String,
            required: [true, "Company is required"],
        },
        helpTopic: {
            type: String,
            required: [true, "Topic is required"],
        },
        challenge: {
            type: String,
            required: [true, "Challenge is required"],
        },
        receiveUpdates: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DiscoveryInteraction", DiscoveryInteractionSchema);
