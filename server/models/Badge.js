const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        
        badgeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        
        image: {
            type: String,
            required: true // Path to uploaded badge image
        },
        
        category: {
            type: String,
            enum: ["achievement", "skill", "participation", "leadership", "other"],
            default: "achievement"
        },
        
        isActive: {
            type: Boolean,
            default: true
        },
        
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
        
        // Requirements or criteria for earning this badge
        criteria: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        
        // Display order in the badge list
        sortOrder: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Indexes for better performance
badgeSchema.index({ isActive: 1 });
badgeSchema.index({ category: 1 });
badgeSchema.index({ sortOrder: 1 });

module.exports = mongoose.model("Badge", badgeSchema);