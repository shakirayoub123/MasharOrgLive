const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const alumniSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
        },

        phone: { type: String, trim: true },
        course: { type: String, trim: true },
        completion_status: { type: String, trim: true },
        completion_year: { type: String, trim: true },

        account_status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        remember_token: { type: String, maxlength: 49, default: "" },

        bio: { type: String, maxlength: 300, default: "" },
        city: { type: String, trim: true, default: "" },
        country: { type: String, trim: true, default: "" },
        
        languages: { type: [String], default: [] },

        // 🟢 Chat Presence Fields
        isOnline: {
            type: Boolean,
            default: false,
            index: true
        },

        lastSeen: {
            type: Date,
            default: null
        },

        avatar: {
            type: String,
            default: "",
        },

        // ✅ BADGE TRACKING WITH FULL HISTORY
        badges: [
            {
                badgeId: {
                    type: String,
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["pending", "approved", "rejected"],
                    default: "pending",
                },
                // Request timestamps
                requestedAt: {
                    type: Date,
                    default: Date.now,
                },
                // Approval/Rejection timestamps
                approvedAt: {
                    type: Date,
                    default: null,
                },
                approvedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Admin',
                    default: null,
                },
                rejectedAt: {
                    type: Date,
                    default: null,
                },
                rejectedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Admin',
                    default: null,
                },
            },
        ],
    },
    { timestamps: true }
);

// ✅ Add indexes for faster badge queries
alumniSchema.index({ 'badges.status': 1 });
alumniSchema.index({ 'badges.approvedAt': 1 });
alumniSchema.index({ 'badges.rejectedAt': 1 });

// Hash password before saving
alumniSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
alumniSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Alumni", alumniSchema);