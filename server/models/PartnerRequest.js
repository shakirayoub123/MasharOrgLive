const mongoose = require("mongoose");

const partnerRequestSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        company: { type: String, required: true, trim: true },
        jobTitle: { type: String, required: true, trim: true },
        website: { type: String, trim: true },
        partnershipType: { type: String, required: true, enum: ["Reseller", "Delivery Partner", "Consulting Partner", "Strategic Alliance", "Other"] },
        region: { type: String, required: true },
        message: { type: String, trim: true, default: "" },
        status: { type: String, enum: ["Pending", "Reviewed", "Contacted", "Closed"], default: "Pending" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PartnerRequest", partnerRequestSchema);
