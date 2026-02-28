const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        eventDate: {
            type: String,
            required: true,
        },
        eventTime: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            enum: ["zoom", "meet"],
            default: "zoom",
        },
        meetingLink: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        host: {
            type: String,
            trim: true,
            maxlength: 80,
            default: "",
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        image: {
            type: String,
            required: true,
        },
        registeredAlumni: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Alumni",
            },
        ],
    },
    { timestamps: true }
);

// Virtual field for backward compatibility
eventSchema.virtual("registeredCount").get(function () {
    return this.registeredAlumni ? this.registeredAlumni.length : 0;
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);