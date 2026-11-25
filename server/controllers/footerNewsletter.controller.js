const FooterNewsletter = require("../models/FooterNewsletter");
const { sendMail, getAdminEmails } = require("../helpers");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

// Subscribe from website footer (Public)
exports.subscribe = async (req, res) => {
  try {
    const rawEmail = (req.body.email || "").trim().toLowerCase();

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const baseUrl = req.headers.origin || process.env.CORS_ALLOWED || "https://www.mashar.org";
    const existing = await FooterNewsletter.findOne({ email: rawEmail });

    if (existing) {
      await sendMail(
        rawEmail,
        "Mashar Newsletter Subscription Confirmation",
        "footer_newsletter_user",
        { email: rawEmail }
      );

      return res.status(200).json({
        success: true,
        message: "You are already subscribed! Confirmation email sent.",
      });
    }

    const subscriber = await FooterNewsletter.create({ email: rawEmail });

    // 1. Send simple confirmation email to the subscriber
    await sendMail(
      rawEmail,
      "Mashar Newsletter Subscription Confirmation",
      "footer_newsletter_user",
      { email: rawEmail }
    );

    // 2. Send simple notification email to admin(s)
    try {
      const actionLink = `${baseUrl}/admin/footer-newsletter`;
      const adminList = Array.from(
        new Set([...getAdminEmails(), "elise@mashar.org"].filter(Boolean))
      );
      const subscribedAt = new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      await Promise.all(
        adminList.map((adminEmail) =>
          sendMail(
            adminEmail,
            `New Footer Newsletter Subscriber: ${rawEmail}`,
            "footer_newsletter_admin",
            {
              email: rawEmail,
              subscribedAt,
              actionLink,
            }
          )
        )
      );
    } catch (mailErr) {
      console.error("Failed to notify admin of footer newsletter subscriber:", mailErr);
    }

    res.status(201).json({
      success: true,
      message: "Subscribed successfully! Please check your email.",
      data: subscriber,
    });
  } catch (err) {
    console.error("FooterNewsletter.subscribe error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Get all footer newsletter subscribers (Admin)
exports.getAll = async (req, res) => {
  try {
    const subscribers = await FooterNewsletter.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: subscribers });
  } catch (err) {
    console.error("FooterNewsletter.getAll error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Delete a footer newsletter subscriber (Admin)
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await FooterNewsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found." });
    }
    res.json({ success: true, message: "Subscriber deleted successfully." });
  } catch (err) {
    console.error("FooterNewsletter.deleteSubscriber error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

