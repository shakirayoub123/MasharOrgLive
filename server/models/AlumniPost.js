const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: false, // ✅ CHANGED: admin posts have no Alumni ref
            index: true
        },
        authorName: {
            type: String,
            trim: true,
            default: "Mashar Admin"
        },

        title: {
            type: String,
            trim: true,
            maxlength: 200
        },

        content: {
            type: String,
            trim: true,
            maxlength: 5000
        },

        image: {
            type: String,
            trim: true,
            default: null
        },

        images: {
            type: [String],
            validate: {
                validator: function (arr) {
                    return arr.length <= 10;
                },
                message: "Maximum 10 images allowed"
            }
        },

        commentsCount: {
            type: Number,
            default: 0
        },

        likesCount: {
            type: Number,
            default: 0
        },

        mentions: {
            type: [String],
            default: []
        },

        tab: {
            type: String,
            enum: ["discussion", "featured", "announcements"],
            default: "discussion",
            index: true
        },

        commentsOpen: {
            type: Boolean,
            default: true
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true
        },

        // ─── MODERATION FIELDS ─────────────────────────────────
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: false
        },

        approvalDate: {
            type: Date,
            required: false
        },

        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500,
            required: false
        },
    },
    { timestamps: true }
);

// Ensure post has text or image
postSchema.pre("validate", function () {
    if (!this.title && !this.content && !this.image && (!this.images || this.images.length === 0)) {
        throw new Error("Post must contain a title, text or at least one image");
    }
});

postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AlumniPost", postSchema);