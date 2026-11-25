const Subscriber = require("../models/Subscriber");
const { sendMail, getAdminEmails } = require("../helpers");

// Submit a new newsletter subscription (Public)
exports.subscribe = async (req, res) => {
  try {
    const rawName = (req.body.user_name || req.body.name || "").trim();
    const email = (req.body.user_email || req.body.email || "").trim();
    const company = (req.body.company || "").trim();
    const source = (req.body.source || (rawName ? "Newsletter Popup" : "Footer Newsletter")).trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    const lowercaseEmail = email.toLowerCase();
    const baseUrl = req.headers.origin || process.env.CORS_ALLOWED || "https://www.mashar.org";
    const logoUrl = `${baseUrl}/assets/masharWhiteFinal.svg`;
    const downloadLink = `${baseUrl}/assets/MasharToolkit.pdf`;
    const isFooter = source === "Footer Newsletter";

    const sendSubscriberEmail = async (firstName) => {
      if (isFooter) {
        return sendMail(
          lowercaseEmail,
          "Thank You for Subscribing to the Mashar Newsletter",
          "footer_newsletter_confirmation",
          {
            name: firstName === "there" ? "" : firstName,
            websiteUrl: baseUrl
          }
        );
      }

      return sendMail(
        lowercaseEmail,
        `Welcome to Mashar, ${firstName}!`,
        "newsletter_welcome",
        {
          name: firstName,
          logoUrl,
          downloadLink
        }
      );
    };

    let subscriber = await Subscriber.findOne({ email: lowercaseEmail });
    if (subscriber) {
      const displayName = rawName || subscriber.name || "";
      const firstName = displayName ? displayName.split(" ")[0] : "there";

      await sendSubscriberEmail(firstName);

      return res.status(200).json({
        success: true,
        message: "You are already subscribed! Confirmation email sent."
      });
    }

    subscriber = await Subscriber.create({
      name: rawName,
      email: lowercaseEmail,
      company
    });

    const firstName = rawName ? rawName.split(" ")[0] : "there";

    // 1. Send Welcome / Confirmation Email to the Subscriber
    await sendSubscriberEmail(firstName);

    // 2. Notify Admin(s) of the New Subscriber
    try {
      const actionLink = `${baseUrl}/admin/subscribers`;
      const adminList = Array.from(new Set([...getAdminEmails(), "elise@mashar.org"].filter(Boolean)));
      const subscribedAt = new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
      });

      await Promise.all(
        adminList.map((adminEmail) =>
          sendMail(
            adminEmail,
            `New Newsletter Subscriber: ${rawName || lowercaseEmail}`,
            "newsletter_admin_alert",
            {
              recipientName: adminEmail.toLowerCase().startsWith("elise") ? "Elise" : "Admin",
              name: rawName,
              email: lowercaseEmail,
              company,
              source,
              subscribedAt,
              actionLink
            }
          )
        )
      );
    } catch (mailErr) {
      console.error("Failed to notify admin of new subscriber:", mailErr);
    }

    res.status(201).json({ success: true, message: "Subscribed successfully! Please check your email.", data: subscriber });
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
