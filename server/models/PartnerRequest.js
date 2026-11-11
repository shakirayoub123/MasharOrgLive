const mongoose = require("mongoose");

const partnerRequestSchema = new mongoose.Schema(
    {
        inquiryType: { type: String, enum: ["partner", "join-team", "both"], default: "partner" },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        company: { type: String, trim: true, default: "" },
        jobTitle: { type: String, trim: true, default: "" },
        website: { type: String, trim: true, default: "" },
        linkedin: { type: String, trim: true, default: "" },
        partnershipType: { type: String, trim: true, default: "Consulting Partner" },
        roleInterest: { type: String, trim: true, default: "" },
        experience: { type: String, trim: true, default: "" },
        region: { type: String, required: true, trim: true },
        message: { type: String, trim: true, default: "" },
        adminNotes: { type: String, trim: true, default: "" },
        status: { type: String, enum: ["Pending", "Reviewed", "Contacted", "Approved", "Declined", "Closed"], default: "Pending" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PartnerRequest", partnerRequestSchema);
