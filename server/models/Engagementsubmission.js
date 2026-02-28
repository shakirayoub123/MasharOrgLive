const mongoose = require("mongoose");

// ─── Sub-schema per type (for clarity, all stored in formData as Mixed) ───────
const EngagementSubmissionSchema = new mongoose.Schema(
    {
        // Which alumni submitted
        alumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Alumni",
            required: true,
        },
        alumniName: { type: String, default: "" },  // denormalised for fast list queries
        alumniEmail: { type: String, default: "" },

        /**
         * type values map directly to the AlumniEngagement.jsx forms:
         *  "mentor"         → BecomeMentor form
         *  "volunteer"      → VolunteerEvents form
         *  "contribute"     → ContributeExpertise form
         *  "success-story"  → SuccessStory (email-based, no form — reserved for future)
         */
        type: {
            type: String,
            enum: ["mentor", "volunteer", "contribute", "success-story"],
            required: true,
        },

        /**
         * Stores the raw formData object exactly as submitted.
         *
         * mentor fields:
         *   full_name, cohort, specialisation, icf_level,
         *   experience_years, mentoring_capacity, motivation, availability
         *
         * volunteer fields:
         *   full_name, email, event_types, role_preference,
         *   experience, availability, motivation
         *
         * contribute fields:
         *   title, type (content type), summary, target_audience,
         *   format, timeline, notes
         *
         * success-story fields:
         *   (submitted via email — reserved, formData may be empty)
         */
        formData: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        // Admin review workflow
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        adminNote: { type: String, default: "" },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
        reviewedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Compound indexes for admin list queries
EngagementSubmissionSchema.index({ type: 1, status: 1, createdAt: -1 });
EngagementSubmissionSchema.index({ alumni: 1, type: 1 });

module.exports = mongoose.model("EngagementSubmission", EngagementSubmissionSchema);