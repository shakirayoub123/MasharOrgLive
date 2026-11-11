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
        const { sendMail } = require("../helpers");

        const {
            inquiryType = "partner",
            firstName,
            lastName,
            email,
            phone,
            company,
            jobTitle,
            website,
            linkedin,
            partnershipType,
            roleInterest,
            experience,
            region,
            message
        } = req.body;

        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !region?.trim()) {
            return res.status(400).json({ success: false, message: "Please fill in all required contact fields." });
        }

        const resolvedType = partnershipType || (inquiryType === "join-team" ? (roleInterest || "Team Member") : "Consulting Partner");

        const request = await PartnerRequest.create({
            inquiryType,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            company: company?.trim() || "Independent / Individual",
            jobTitle: jobTitle?.trim() || roleInterest?.trim() || "Applicant",
            website: website?.trim() || "",
            linkedin: linkedin?.trim() || "",
            partnershipType: resolvedType,
            roleInterest: roleInterest?.trim() || "",
            experience: experience?.trim() || "",
            region: region.trim(),
            message: message?.trim() || ""
        });

        // Send confirmation email internally (optional but good practice)
        try {
            await sendMail(
                "elise@mashar.org",
                `New ${inquiryType === "join-team" ? "Team / Coach Application" : "Partner Request"}: ${firstName} ${lastName}`,
                "new_partner_request",
                {
                    full_name: `${firstName} ${lastName}`,
                    inquiryType,
                    email,
                    phone,
                    company: company || "Independent",
                    jobTitle: jobTitle || roleInterest,
                    partnershipType: resolvedType,
                    region,
                    message
                }
            );
        } catch (e) {
            console.error("Failed to send partner request email:", e);
        }

        return res.status(201).json({
            success: true,
            message: inquiryType === "join-team"
                ? "Your application to join our team has been successfully submitted."
                : "Your partner request has been successfully submitted."
        });
    } catch (err) {
        console.error("Partner request error:", err);
        res.status(500).json({ success: false, message: "Failed to submit request. Please try again." });
    }
});

module.exports = router;
