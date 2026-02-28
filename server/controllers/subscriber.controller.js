const Subscriber = require("../models/Subscriber");
const { sendMail } = require("../helpers");

// Submit a new newsletter subscription (Public)
exports.subscribe = async (req, res) => {
  try {
    const name = req.body.user_name || req.body.name;
    const email = req.body.user_email || req.body.email;
    const company = req.body.company || "";

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required." });
    }

    const lowercaseEmail = email.toLowerCase().trim();

    let subscriber = await Subscriber.findOne({ email: lowercaseEmail });
    if (subscriber) {
      const firstName = name.trim().split(" ")[0] || "Subscriber";
      const baseUrl = req.headers.origin || process.env.CORS_ALLOWED || "https://www.mashar.org/";
      const logoUrl = `${baseUrl}/assets/masharWhiteFinal.svg`;
      const downloadLink = `${baseUrl}/assets/MasharToolkit.pdf`;

      // Trigger the welcome email again
      await sendMail(lowercaseEmail, `Welcome to Mashar, ${firstName}!`, "newsletter_welcome", {
        name: firstName,
        logoUrl,
        downloadLink
      });

      return res.status(200).json({ success: true, message: "You are already subscribed! Welcome email sent again." });
    }

    subscriber = await Subscriber.create({
      name: name.trim(),
      email: lowercaseEmail,
      company: company.trim()
    });

    const firstName = name.trim().split(" ")[0] || "Subscriber";
    const baseUrl = req.headers.origin || process.env.CORS_ALLOWED || "https://www.mashar.org/";
    const logoUrl = `${baseUrl}/assets/masharWhiteFinal.svg`;
    const downloadLink = `${baseUrl}/assets/MasharToolkit.pdf`;

    // Send Welcome Email
    await sendMail(lowercaseEmail, `Welcome to Mashar, ${firstName}!`, "newsletter_welcome", {
      name: firstName,
      logoUrl,
      downloadLink
    });

    res.status(201).json({ success: true, message: "Subscribed successfully!", data: subscriber });
  } catch (err) {
    console.error("Subscriber.subscribe error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Get all subscribers (Admin)
exports.getAll = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: subscribers });
  } catch (err) {
    console.error("Subscriber.getAll error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Delete a subscriber (Admin)
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found." });
    }
    res.json({ success: true, message: "Subscriber deleted successfully." });
  } catch (err) {
    console.error("Subscriber.deleteSubscriber error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
