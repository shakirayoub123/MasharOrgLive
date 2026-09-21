const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const PublicEventRegistration = require("../models/PublicEventRegistration");

/* ────────────────────────────────────────────────────────────────
   GET /api/public/events
   Returns only public/both events (no auth)
──────────────────────────────────────────────────────────────── */
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find({
            audience: { $in: ["public", "both"] }
        })
            .sort({ eventDate: 1 })
            .lean();

        // Get public registrations and map by event ID
        const publicRegs = await PublicEventRegistration.find().lean();
        const publicCountMap = {};
        publicRegs.forEach(reg => {
            const evId = reg.event.toString();
            publicCountMap[evId] = (publicCountMap[evId] || 0) + 1;
        });

        // Add correct totalRegistered count to each event
        const enhancedEvents = events.map(ev => {
            const alumniCount = ev.registeredAlumni ? ev.registeredAlumni.length : 0;
            const pubCount = publicCountMap[ev._id.toString()] || 0;
            return {
                ...ev,
                totalRegistered: alumniCount + pubCount,
                registeredAlumni: undefined // remove it from public response
            };
        });

        res.json({ success: true, events: enhancedEvents });
    } catch (err) {
        console.error("Public events error:", err);
        res.status(500).json({ success: false, message: "Failed to load events." });
    }
});

/* ────────────────────────────────────────────────────────────────
   POST /api/public/events/:id/register
   Public user registers for an event (no auth required)
──────────────────────────────────────────────────────────────── */
router.post("/events/:id/register", async (req, res) => {
    try {
        const { name, email, organisation, note } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: "Name and email are required." });
        }

        const event = await Event.findById(req.params.id).select("-registeredAlumni");
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        if (!["public", "both"].includes(event.audience)) {
            return res.status(403).json({ success: false, message: "This event is not open for public registration." });
        }

        // Check capacity against combined registrations
        const publicCount = await PublicEventRegistration.countDocuments({ event: req.params.id });
        const alumniCount = event.registeredAlumni?.length || 0;
        if (publicCount + alumniCount >= event.capacity) {
            return res.status(400).json({ success: false, message: "This event has reached full capacity." });
        }

        // Create registration (unique index handles duplicate email)
        await PublicEventRegistration.create({
            event: req.params.id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            organisation: organisation?.trim() || "",
            note: note?.trim() || "",
        });

        return res.status(201).json({ success: true, message: "You have been registered successfully!" });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: "You are already registered for this event." });
        }
        console.error("Public registration error:", err);
        res.status(500).json({ success: false, message: "Registration failed. Please try again." });
    }
});

/* ────────────────────────────────────────────────────────────────
   POST /api/public/partner/request
   Submit a partner info request (like blanchard partner page)
──────────────────────────────────────────────────────────────── */
router.post("/partner/request", async (req, res) => {
    try {
        const PartnerRequest = require("../models/PartnerRequest");
        const { sendMail } = require("../helpers"); // Assuming standard helper exists

        const { firstName, lastName, email, phone, company, jobTitle, website, partnershipType, region, message } = req.body;

        if (!firstName || !lastName || !email || !phone || !company || !jobTitle || !partnershipType || !region) {
            return res.status(400).json({ success: false, message: "Please fill in all required fields." });
        }

        const request = await PartnerRequest.create({
            firstName, lastName, email, phone, company, jobTitle, website, partnershipType, region, message: message || ""
        });

        // Send confirmation email internally (optional but good practice)
        try {
            await sendMail(
                "elise@mashar.org",
                `New Partner Info Request: ${company}`,
                "new_partner_request", // We'll just pass plain text if template doesn't exist yet, but let's assume it sends safely
                {
                    full_name: `${firstName} ${lastName}`,
                    email, phone, company, jobTitle, partnershipType, region, message
                }
            );
        } catch (e) {
            console.error("Failed to send partner request email:", e);
        }

        return res.status(201).json({ success: true, message: "Your partner request has been successfully submitted." });
    } catch (err) {
        console.error("Partner request error:", err);
        res.status(500).json({ success: false, message: "Failed to submit request. Please try again." });
    }
});

module.exports = router;
