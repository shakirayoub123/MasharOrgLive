const Event = require("../../models/Event");
const fs = require("fs");
const path = require("path");
const {notifyGlobally} = require("../../events/notifier");

// @desc    Create a new event
// @route   POST /api/admin/events
// @access  Admin
const createEvent = async (req, res) => {
    try {
        const { eventName, eventDate, eventTime, platform, meetingLink, location, host, description, capacity } = req.body;

        if (!eventName || !eventDate || !eventTime || !location || !description || !capacity || !meetingLink) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an event image." });
        }

        const capacityNum = parseInt(capacity);
        if (isNaN(capacityNum) || capacityNum <= 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Please enter a valid capacity number." });
        }

        const imagePath = `uploads/images/${req.file.filename}`;

        const event = await Event.create({
            eventName: eventName.trim(),
            eventDate,
            eventTime,
            platform: platform || "zoom",
            meetingLink: meetingLink.trim(),
            location: location.trim(),
            host: host ? host.trim() : "",
            description: description.trim(),
            capacity: capacityNum,
            image: imagePath,
        });

        await notifyGlobally("A new event has been announced.", "/alumni/resourcessection");

        return res.status(201).json({ message: "Event published successfully.", event });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("createEvent error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Get all events
// @route   GET /api/admin/events
// @access  Admin
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).populate("registeredAlumni", "full_name email course");
        return res.status(200).json({ events });
    } catch (error) {
        console.error("getAllEvents error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Get single event
// @route   GET /api/admin/events/:id
// @access  Admin
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("registeredAlumni", "full_name email course");
        if (!event) return res.status(404).json({ message: "Event not found." });
        return res.status(200).json({ event });
    } catch (error) {
        console.error("getEventById error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Update an event
// @route   PUT /api/admin/events/:id
// @access  Admin
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Event not found." });
        }

        const { eventName, eventDate, eventTime, platform, meetingLink, location, host, description, capacity } = req.body;

        if (capacity) {
            const capacityNum = parseInt(capacity);
            if (isNaN(capacityNum) || capacityNum <= 0) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({ message: "Please enter a valid capacity number." });
            }
            event.capacity = capacityNum;
        }

        if (eventName) event.eventName = eventName.trim();
        if (eventDate) event.eventDate = eventDate;
        if (eventTime) event.eventTime = eventTime;
        if (platform) event.platform = platform;
        if (meetingLink) event.meetingLink = meetingLink.trim();
        if (location) event.location = location.trim();
        if (host !== undefined) event.host = host.trim();
        if (description) event.description = description.trim();

        if (req.file) {
            const oldImagePath = path.join(process.cwd(), event.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            event.image = `uploads/images/${req.file.filename}`;
        }

        await event.save();
        return res.status(200).json({ message: "Event updated successfully.", event });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("updateEvent error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        const imagePath = path.join(process.cwd(), event.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        await event.deleteOne();
        return res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error("deleteEvent error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };