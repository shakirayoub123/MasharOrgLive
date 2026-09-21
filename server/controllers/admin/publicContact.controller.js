const ContactSubmission = require("../../models/ContactSubmission");

exports.getAll = async (req, res) => {
    try {
        const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
        res.json({ success: true, submissions });
    } catch (err) {
        console.error("Fetch contact submissions error", err);
        res.status(500).json({ success: false, message: "Backend error" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const entry = await ContactSubmission.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!entry) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, entry });
    } catch (err) {
        res.status(500).json({ success: false, message: "Backend error" });
    }
};

exports.deleteSubmission = async (req, res) => {
    try {
        await ContactSubmission.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: "Backend error" });
    }
};
