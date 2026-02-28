const mongoose = require("mongoose");

const resourceLikeSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ["post", "article", "book", "video"],
      required: true,
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

resourceLikeSchema.index({ resourceType: 1, resourceId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("ResourceLike", resourceLikeSchema);
