const mongoose = require("mongoose");

const ContactRequestSchema = new mongoose.Schema(
  {
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    alumniName: { type: String, default: "" },
    alumniEmail: { type: String, default: "" },
    type: {
      type: String,
      enum: [
        "certificate", "letter", "transcript", "access", "data-update", "other",
        "general", "technical", "account", "events", "programs", "feedback"
      ],
      required: true,
    },
    subject: { type: String, default: "" },
    details: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactRequest", ContactRequestSchema);
