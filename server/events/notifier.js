const EventEmitter = require("events");
const Notification = require("../models/Notification");
const Alumni = require("../models/Alumni");
const { sendMail } = require("./../helpers");

class EmailEmitter extends EventEmitter {}

const mailer = new EmailEmitter();

mailer.on("sendEmail", async ({ to, subject, templateName, data }) => {
    console.log("sendEmail event listened");
    try {
        await sendMail(to, subject, templateName, data);
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Error sending email:", err);
    }
});
const notifyGlobally = async (message, actionLink) => {
    if (!global.io) {
        console.error("Socket.IO not initialized yet.");
        return;
    }

    global.io.emit("f9Tz3Kw8mXqP2nVbRjL5sYcDhA4eGuN", {
        message,
        action_link: actionLink,
    });

    await Notification.create({
        message,
        action_link: actionLink,
        channel: "alumni",
    });

    try {
        const alumniMembers = await Alumni.find({ account_status: "approved" })
            .select("full_name email")
            .lean();

        alumniMembers.forEach((alumni) => {
            if (!alumni.email) return;

            mailer.emit("sendEmail", {
                to: alumni.email,
                subject: `New update from Mashar: ${message}`,
                templateName: "news_announcement",
                data: {
                    name: alumni.full_name || "Alumni",
                    message,
                    actionLink,
                },
            });
        });
    } catch (err) {
        console.error("Failed to send global announcement emails:", err);
    }
};

const notify = async (payload) => {
    if (!global.io) {
        console.error("Socket.IO not initialized yet.");
        return;
    }

    if (!payload?.model_id) {
        console.error("notify() requires a user_id in payload.");
        return;
    }

    global.io.emit(`msh_alumni_${payload.model_id}`, {
        message: payload.message,
        action_link: payload.action_link,
    });

    await Notification.create({
        message: payload.message,
        action_link: payload.action_link,
        notifiable_id: payload.model_id,
        notifiable_type: payload.model_type,
    });
};

module.exports = { mailer, notifyGlobally, notify };