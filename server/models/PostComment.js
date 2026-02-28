const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AlumniPost",
            required: true,
            index: true
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true,
            index: true
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },
        mentions: {
            type: [String],
            default: []
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// For fetching comments of a post sorted newest first
commentSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model("PostComment", commentSchema);