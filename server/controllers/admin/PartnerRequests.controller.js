const PartnerRequest = require("../../models/PartnerRequest");

/**
 * GET /api/admin/partner-requests
 * Retrieve all partner & team requests with optional filtering and summary stats.
 */
exports.getAll = async (req, res) => {
    try {
        const { status, search, type } = req.query;
        const query = {};

        if (status && status !== "All") {
            query.status = status;
        }

        if (type && type !== "All") {
            query.partnershipType = type;
        }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [
                { firstName: regex },
                { lastName: regex },
                { company: regex },
                { email: regex },
                { phone: regex },
                { region: regex },
                { partnershipType: regex },
            ];
        }

        const requests = await PartnerRequest.find(query).sort({ createdAt: -1 });

        // Aggregate summary counts across all requests (unfiltered)
        const allRequests = await PartnerRequest.find().lean();
        const counts = {
            total: allRequests.length,
            pending: allRequests.filter(r => r.status === "Pending").length,
            reviewed: allRequests.filter(r => r.status === "Reviewed").length,
            contacted: allRequests.filter(r => r.status === "Contacted").length,
            approved: allRequests.filter(r => r.status === "Approved").length,
            declined: allRequests.filter(r => r.status === "Declined" || r.status === "Closed").length,
        };

        res.json({
            success: true,
            requests,
            counts,
        });
    } catch (err) {
        console.error("Fetch partner requests error:", err);
        res.status(500).json({ success: false, message: "Server error fetching partner requests." });
    }
};

/**
 * GET /api/admin/partner-requests/:id
 */
exports.getById = async (req, res) => {
    try {
        const request = await PartnerRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Partner request not found." });
        }
        res.json({ success: true, request });
    } catch (err) {
        console.error("Get partner request by id error:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

/**
 * PATCH /api/admin/partner-requests/:id/status
 * Body: { status }
 */
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Reviewed", "Contacted", "Approved", "Declined", "Closed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        const request = await PartnerRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: "Partner request not found." });
        }

        res.json({ success: true, request, message: `Status updated to ${status}` });
    } catch (err) {
        console.error("Update partner request status error:", err);
        res.status(500).json({ success: false, message: "Server error updating status." });
    }
};

/**
 * PATCH /api/admin/partner-requests/:id/notes
 * Body: { adminNotes }
 */
exports.updateNotes = async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const request = await PartnerRequest.findByIdAndUpdate(
            req.params.id,
            { adminNotes: adminNotes || "" },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: "Partner request not found." });
        }

        res.json({ success: true, request, message: "Notes saved successfully." });
    } catch (err) {
        console.error("Update partner request notes error:", err);
        res.status(500).json({ success: false, message: "Server error saving notes." });
    }
};

/**
 * DELETE /api/admin/partner-requests/:id
 */
exports.deleteRequest = async (req, res) => {
    try {
        const request = await PartnerRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Partner request not found." });
        }
        res.json({ success: true, message: "Partner request deleted successfully." });
    } catch (err) {
        console.error("Delete partner request error:", err);
        res.status(500).json({ success: false, message: "Server error deleting request." });
    }
};

