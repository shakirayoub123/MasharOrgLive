const mongoose = require("mongoose");

const contactSubmissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    organization: { type: String },
    service: { type: String },
    message: { type: String },
    status: { type: String, enum: ['New', 'Reviewed', 'Replied'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model("ContactSubmission", contactSubmissionSchema);
