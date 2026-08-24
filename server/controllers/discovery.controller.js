const DiscoveryInteraction = require("../models/DiscoveryInteraction");
const { sendMail } = require("../helpers");

exports.submitForm = async (req, res) => {
    try {
        const { name, email, company, helpTopic, challenge, receiveUpdates } = req.body;
        const newInteraction = new DiscoveryInteraction({
            name,
            email,
            company,
            helpTopic,
            challenge,
            receiveUpdates,
        });
        await newInteraction.save();

        try {
            const actionLink = (req.headers.origin || "https://www.mashar.org") + "/admin/discovery";
            await sendMail(
                "elise@mashar.org",
                "New Discovery Request Submitted",
                "news_announcement",
                {
                    name: "Elise",
                    message: `A new discovery request was submitted by <strong>${name}</strong> (${email}) from <strong>${company}</strong>.<br><br><strong>Topic:</strong> ${helpTopic}<br><strong>Challenge:</strong> ${challenge}`,
                    actionLink
                }
            );
        } catch (mailErr) {
            console.error("Failed to notify admin of discovery request:", mailErr);
        }

        res.status(201).json({ success: true, data: newInteraction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInteractions = async (req, res) => {
    try {
        const interactions = await DiscoveryInteraction.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: interactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteInteraction = async (req, res) => {
    try {
        const { id } = req.params;
        await DiscoveryInteraction.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
