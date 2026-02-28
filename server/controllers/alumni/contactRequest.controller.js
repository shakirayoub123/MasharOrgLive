const ContactRequest = require("../../models/ContactRequest");

// Alumni: submit a new request
exports.submit = async (req, res) => {
  try {
    const { type, details } = req.body;
    if (!type || !details) {
      return res.status(400).json({ success: false, message: "Type and details are required." });
    }

    const doc = await ContactRequest.create({
      alumni: req.user._id,
      alumniName: req.user.full_name || "",
      alumniEmail: req.user.email || "",
      type,
      details,
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error("contactRequest.submit error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Alumni: get my requests
exports.myRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ alumni: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("contactRequest.myRequests error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// Admin: get all requests
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;

    const requests = await ContactRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("alumni", "full_name email profile_picture course completion_year")
      .lean();

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("contactRequest.getAll error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Admin: get stats
exports.stats = async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      ContactRequest.countDocuments(),
      ContactRequest.countDocuments({ status: "pending" }),
      ContactRequest.countDocuments({ status: "approved" }),
      ContactRequest.countDocuments({ status: "rejected" }),
    ]);
    res.json({ success: true, data: { total, pending, approved, rejected } });
  } catch (err) {
    console.error("contactRequest.stats error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Admin: update status
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const doc = await ContactRequest.findByIdAndUpdate(
      req.params.id,
      { status, ...(adminNote !== undefined && { adminNote }) },
      { new: true }
    ).lean();

    if (!doc) return res.status(404).json({ success: false, message: "Request not found." });
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error("contactRequest.updateStatus error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Admin: delete request
exports.deleteRequest = async (req, res) => {
  try {
    const doc = await ContactRequest.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Request not found." });
    res.json({ success: true, message: "Request deleted." });
  } catch (err) {
    console.error("contactRequest.deleteRequest error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
