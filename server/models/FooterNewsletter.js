const mongoose = require("mongoose");

const FooterNewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FooterNewsletter", FooterNewsletterSchema);

