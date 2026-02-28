const mongoose = require("mongoose");

const postLikeSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AlumniPost",
            required: true,
            index: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true,
            index: true
        }
    },
    { timestamps: true }
);

// Prevent duplicate likes (VERY IMPORTANT)
postLikeSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("PostLike", postLikeSchema);