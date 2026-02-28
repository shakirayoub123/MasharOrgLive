const Event = require("../../models/Event");
const { sendMail } = require("../../helpers");

// @desc    Get all events (alumni view)
// @route   GET /api/alumni/events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ eventDate: 1 });

        // Add isRegistered flag for the logged-in alumni
        const alumniId = req.user._id.toString();
        const eventsWithStatus = events.map((ev) => {
            const obj = ev.toJSON();
            obj.isRegistered = ev.registeredAlumni.some(
                (id) => id.toString() === alumniId
            );
            return obj;
        });

        return res.status(200).json({ events: eventsWithStatus });
    } catch (error) {
        console.error("getEvents error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Get single event (alumni view)
// @route   GET /api/alumni/events/:id
const getEventDetails = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        const obj = event.toJSON();
        obj.isRegistered = event.registeredAlumni.some(
            (id) => id.toString() === req.user._id.toString()
        );

        return res.status(200).json({ event: obj });
    } catch (error) {
        console.error("getEventDetails error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Register for an event
// @route   POST /api/alumni/events/:id/register
const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        const alumniId = req.user._id;

        // Already registered?
        if (event.registeredAlumni.some((id) => id.toString() === alumniId.toString())) {
            return res.status(400).json({ message: "You are already registered for this event." });
        }

        // Capacity check
        if (event.registeredAlumni.length >= event.capacity) {
            return res.status(400).json({ message: "This event has reached full capacity." });
        }

        event.registeredAlumni.push(alumniId);
        await event.save();

        // Send confirmation email (non-blocking)
        const platformLabel = event.platform === "zoom" ? "Zoom" : "Google Meet";
        try {
            await sendMail(
                req.user.email,
                `You're registered: ${event.eventName}`,
                "event_registration",
                {
                    full_name: req.user.full_name,
                    eventName: event.eventName,
                    eventDate: event.eventDate,
                    eventTime: event.eventTime,
                    location: event.location,
                    platform: platformLabel,
                    meetingLink: event.meetingLink,
                    host: event.host || "TBD",
                }
            );
        } catch (emailErr) {
            console.error("Registration email failed:", emailErr);
        }

        const obj = event.toJSON();
        obj.isRegistered = true;

        return res.status(200).json({ message: "Registered successfully!", event: obj });
    } catch (error) {
        console.error("registerForEvent error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Unregister from an event
// @route   POST /api/alumni/events/:id/unregister
const unregisterFromEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        const alumniId = req.user._id.toString();

        if (!event.registeredAlumni.some((id) => id.toString() === alumniId)) {
            return res.status(400).json({ message: "You are not registered for this event." });
        }

        event.registeredAlumni = event.registeredAlumni.filter(
            (id) => id.toString() !== alumniId
        );
        await event.save();

        const obj = event.toJSON();
        obj.isRegistered = false;

        return res.status(200).json({ message: "Unregistered successfully.", event: obj });
    } catch (error) {
        console.error("unregisterFromEvent error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { getEvents, getEventDetails, registerForEvent, unregisterFromEvent };