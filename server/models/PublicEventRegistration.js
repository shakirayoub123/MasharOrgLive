const mongoose = require("mongoose");

const publicEventRegistrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 150,
        },
        organisation: {
            type: String,
            trim: true,
            maxlength: 150,
            default: "",
        },
        note: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
    },
    { timestamps: true }
);

// One registration per email per event
publicEventRegistrationSchema.index({ event: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("PublicEventRegistration", publicEventRegistrationSchema);
