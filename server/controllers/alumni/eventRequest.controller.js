const EventRequest = require("../../models/EventRequest");

const VALID_TYPES = ["coach-to-coach", "hot-seat", "peer-coaching", "webinar"];
const ALUMNI_POPULATE = "full_name email course completion_year city country";

function getAlumni(req) {
    return req.alumni || req.user || req.alumniUser || req.alumniData || null;
}

// ══════════════════════════════════════════════════════════════════════════════
// ALUMNI — Submit event request
// POST /api/alumni/events/request
// Body: { eventTypeId, eventLabel }
// ══════════════════════════════════════════════════════════════════════════════
exports.request = async (req, res) => {
    try {
        const alumni = getAlumni(req);
        if (!alumni) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        const alumniId = alumni._id || alumni.id;
        const alumniName = alumni.full_name || alumni.name || "";
        const alumniEmail = alumni.email || "";

        if (!alumniId) {
            return res.status(401).json({ success: false, message: "Unauthorized. Alumni ID missing." });
        }

        const { eventTypeId, eventLabel } = req.body;

        if (!VALID_TYPES.includes(eventTypeId)) {
            return res.status(400).json({ success: false, message: "Invalid event type." });
        }

        // ── Block duplicate pending/approved requests for same event type ─────
        const existing = await EventRequest.findOne({
            alumni: alumniId,
            eventTypeId,
            status: { $in: ["pending", "approved"] },
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: `You already have a ${eventTypeId} request with status "${existing.status}".`,
                data: existing,
            });
        }

        const eventRequest = await EventRequest.create({
            alumni: alumniId,
            alumniName,
            alumniEmail,
            eventTypeId,
            eventLabel: eventLabel || eventTypeId,
            status: "pending",
        });

        res.status(201).json({ success: true, data: eventRequest });
    } catch (err) {
        console.error("eventRequest.request error:", err.message);
        res.status(500).json({ success: false, message: "Server error.", error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ALUMNI — Get own requests
// GET /api/alumni/events/my-requests
// ══════════════════════════════════════════════════════════════════════════════
exports.myRequests = async (req, res) => {
    try {
        const alumni = getAlumni(req);
        const alumniId = alumni?._id || alumni?.id;

        if (!alumniId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        const requests = await EventRequest
            .find({ alumni: alumniId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, data: requests });
    } catch (err) {
        console.error("eventRequest.myRequests error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Get all requests
// GET /api/admin/events/requests?eventTypeId=coach-to-coach&status=pending&page=1&limit=50
// ══════════════════════════════════════════════════════════════════════════════
exports.getAll = async (req, res) => {
    try {
        const filter = {};
        const { eventTypeId, status, page = 1, limit = 50 } = req.query;

        if (eventTypeId && VALID_TYPES.includes(eventTypeId)) filter.eventTypeId = eventTypeId;
        if (status && ["pending", "approved", "rejected"].includes(status)) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);
        const total = await EventRequest.countDocuments(filter);

        const requests = await EventRequest
            .find(filter)
            .populate("alumni", ALUMNI_POPULATE)
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        res.json({
            success: true,
            data: requests,
            meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
        });
    } catch (err) {
        console.error("eventRequest.getAll error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Get single request
// GET /api/admin/events/requests/:id
// ══════════════════════════════════════════════════════════════════════════════
exports.getOne = async (req, res) => {
    try {
        const request = await EventRequest
            .findById(req.params.id)
            .populate("alumni", ALUMNI_POPULATE)
            .populate("reviewedBy", "name email")
            .lean();

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }

        res.json({ success: true, data: request });
    } catch (err) {
        console.error("eventRequest.getOne error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Update status
// PATCH /api/admin/events/requests/:id/status
// Body: { status: "approved"|"rejected"|"pending", adminNote?: string }
// ══════════════════════════════════════════════════════════════════════════════
exports.updateStatus = async (req, res) => {
    try {
        const { status, adminNote = "" } = req.body;

        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        const request = await EventRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }

        const admin = req.admin || req.adminUser || req.user;

        request.status = status;
        request.adminNote = adminNote;
        request.reviewedBy = admin?._id || admin?.id || null;
        request.reviewedAt = new Date();
        await request.save();

        res.json({ success: true, data: request });
    } catch (err) {
        console.error("eventRequest.updateStatus error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Delete request
// DELETE /api/admin/events/requests/:id
// ══════════════════════════════════════════════════════════════════════════════
exports.remove = async (req, res) => {
    try {
        const request = await EventRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }
        res.json({ success: true, message: "Request deleted." });
    } catch (err) {
        console.error("eventRequest.remove error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — Stats
// GET /api/admin/events/requests/stats
// ══════════════════════════════════════════════════════════════════════════════
exports.stats = async (req, res) => {
    try {
        const agg = await EventRequest.aggregate([
            { $group: { _id: { eventTypeId: "$eventTypeId", status: "$status" }, count: { $sum: 1 } } },
        ]);

        const result = {};
        for (const { _id, count } of agg) {
            if (!result[_id.eventTypeId]) {
                result[_id.eventTypeId] = { pending: 0, approved: 0, rejected: 0, total: 0 };
            }
            result[_id.eventTypeId][_id.status] = count;
            result[_id.eventTypeId].total += count;
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
        console.error("eventRequest.stats error:", err.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};