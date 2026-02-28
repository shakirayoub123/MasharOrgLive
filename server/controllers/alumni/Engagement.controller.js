const EngagementSubmission = require("../../models/Engagementsubmission");
const VALID_TYPES = ["mentor", "volunteer", "contribute", "success-story"];
const ALUMNI_POPULATE = "full_name email course completion_year city country bio";

// ─── Helper: resolve alumni from whichever property the middleware sets ───────
// Different projects attach the authenticated user differently.
// This handles: req.alumni, req.user, req.alumniUser, req.alumniData
function getAlumni(req) {
    return req.alumni || req.user || req.alumniUser || req.alumniData || null;
}

// ══════════════════════════════════════════════════════════════════════════════
// ALUMNI — Submit
// POST /api/alumni/engage/:type
// ══════════════════════════════════════════════════════════════════════════════
exports.submit = async (req, res) => {
    try {
        const { type } = req.params;

        if (!VALID_TYPES.includes(type)) {
            return res.status(400).json({ success: false, message: "Invalid submission type." });
        }

        // ── Resolve the authenticated alumni ──────────────────────────────────────
        const alumni = getAlumni(req);

        if (!alumni) {
            return res.status(401).json({ success: false, message: "Unauthorized. Alumni not found in request." });
        }

        const alumniId = alumni._id || alumni.id;
        const alumniName = alumni.full_name || alumni.name || alumni.fullName || "";
        const alumniEmail = alumni.email || "";

        if (!alumniId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Alumni ID missing." });
        }

        // ── Block duplicate pending / approved submissions of same type ───────────
        const existing = await EngagementSubmission.findOne({
            alumni: alumniId,
            type,
            status: { $in: ["pending", "approved"] },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: `You already have a ${type} submission with status "${existing.status}". Please wait for a decision before resubmitting.`,
                data: existing,
            });
        }

        // ── Create submission ─────────────────────────────────────────────────────
        const submission = await EngagementSubmission.create({
            alumni: alumniId,
            alumniName,
            alumniEmail,
            type,
            formData: req.body,
            status: "pending",
        });

        res.status(201).json({ success: true, data: submission });
    } catch (err) {
        console.error("engagement.submit error:", err.message);
        res.status(500).json({ success: false, message: "Server error.", error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ALUMNI — Get own submissions
// GET /api/alumni/engage/my-submissions
// ══════════════════════════════════════════════════════════════════════════════
exports.mySubmissions = async (req, res) => {
    try {
        const alumni = getAlumni(req);
        const alumniId = alumni?._id || alumni?.id;

        if (!alumniId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        const submissions = await EngagementSubmission
            .find({ alumni: alumniId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, data: submissions });
    } catch (err) {
        console.error("engagement.mySubmissions error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Get all submissions
// GET /api/admin/engage/submissions?type=mentor&status=pending&page=1&limit=50
// ══════════════════════════════════════════════════════════════════════════════
exports.getAll = async (req, res) => {
    try {
        const filter = {};
        const { type, status, page = 1, limit = 50 } = req.query;

        if (type && VALID_TYPES.includes(type)) filter.type = type;
        if (status && ["pending", "approved", "rejected"].includes(status)) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);
        const total = await EngagementSubmission.countDocuments(filter);

        const submissions = await EngagementSubmission
            .find(filter)
            .populate("alumni", ALUMNI_POPULATE)
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        res.json({
            success: true,
            data: submissions,
            meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
        });
    } catch (err) {
        console.error("engagement.getAll error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Typed convenience endpoint factory
// GET /api/admin/engage/mentor-applications  etc.
// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Typed convenience endpoint factory
// ══════════════════════════════════════════════════════════════════════════════
exports.getByType = (type) => async (req, res) => {
    try {
        const filter = { type }; // ← hardcoded, not from req.query

        const { status, page = 1, limit = 50 } = req.query;
        if (status && ["pending", "approved", "rejected"].includes(status)) {
            filter.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await EngagementSubmission.countDocuments(filter);

        const submissions = await EngagementSubmission
            .find(filter)
            .populate("alumni", ALUMNI_POPULATE)
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        res.json({
            success: true,
            data: submissions,
            meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
        });
    } catch (err) {
        console.error("engagement.getByType error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Get single submission
// GET /api/admin/engage/submissions/:id
// ══════════════════════════════════════════════════════════════════════════════
exports.getOne = async (req, res) => {
    try {
        const submission = await EngagementSubmission
            .findById(req.params.id)
            .populate("alumni", ALUMNI_POPULATE)
            .populate("reviewedBy", "name email")
            .lean();

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found." });
        }

        res.json({ success: true, data: submission });
    } catch (err) {
        console.error("engagement.getOne error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Update submission status
// PATCH /api/admin/engage/submissions/:id/status
// Body: { status: "approved"|"rejected"|"pending", adminNote?: string }
// ══════════════════════════════════════════════════════════════════════════════
exports.updateStatus = async (req, res) => {
    try {
        const { status, adminNote = "" } = req.body;

        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        const submission = await EngagementSubmission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found." });
        }

        const admin = req.admin || req.adminUser || req.user;

        submission.status = status;
        submission.adminNote = adminNote;
        submission.reviewedBy = admin?._id || admin?.id || null;
        submission.reviewedAt = new Date();
        await submission.save();

        res.json({ success: true, data: submission });
    } catch (err) {
        console.error("engagement.updateStatus error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Delete submission
// DELETE /api/admin/engage/submissions/:id
// ══════════════════════════════════════════════════════════════════════════════
exports.remove = async (req, res) => {
    try {
        const submission = await EngagementSubmission.findByIdAndDelete(req.params.id);
        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found." });
        }
        res.json({ success: true, message: "Submission deleted." });
    } catch (err) {
        console.error("engagement.remove error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Stats
// GET /api/admin/engage/stats
// ══════════════════════════════════════════════════════════════════════════════
exports.stats = async (req, res) => {
    try {
        const agg = await EngagementSubmission.aggregate([
            { $group: { _id: { type: "$type", status: "$status" }, count: { $sum: 1 } } },
        ]);

        const result = {};
        for (const { _id, count } of agg) {
            if (!result[_id.type]) result[_id.type] = { pending: 0, approved: 0, rejected: 0, total: 0 };
            result[_id.type][_id.status] = count;
            result[_id.type].total += count;
        }

        const overall = { pending: 0, approved: 0, rejected: 0, total: 0 };
        for (const t of Object.values(result)) {
            overall.pending += t.pending;
            overall.approved += t.approved;
            overall.rejected += t.rejected;
            overall.total += t.total;
        }
        result.overall = overall;

        res.json({ success: true, data: result });
    } catch (err) {
        console.error("engagement.stats error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};