// Model for alumni requests to access private programs
const mongoose = require('mongoose');

const ProgramAccessRequestSchema = new mongoose.Schema(
    {
        alumniId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
        programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    },
    { timestamps: true }
);

ProgramAccessRequestSchema.index({ alumniId: 1, programId: 1 }, { unique: true });

module.exports = mongoose.model('ProgramAccessRequest', ProgramAccessRequestSchema);

