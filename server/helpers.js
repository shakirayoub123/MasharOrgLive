async function startServer(app, PORT) {
    try {
        const http = require("http");
        const { Server } = require("socket.io");
        const mongoose = require("mongoose");
        const dns = require("dns");
        dns.setServers(["1.1.1.1", "8.8.8.8"]);

        const server = http.createServer(app);

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");

        // ✅ Attach Socket.IO to same HTTP server
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Make io globally accessible if needed
        global.io = io;

        // Load socket events
        require('./socket/chat.socket')(io);

        io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("Socket disconnected:", socket.id);
            });
        });

        const effectivePort = process.env.PORT || PORT;
        server.listen(effectivePort, "0.0.0.0", () => {
            console.log(`🚀 Server running on port ${effectivePort}`);
        });

    } catch (err) {
        console.error("Server startup failed:", err.message);
        process.exit(1);
    }
}

function errorResponse(res, message = "", code = 500) {
    const response = {
        success: false,
    };

    if (message.length > 0) {
        response.message = message;
    }

    return res.status(code).json(response);
}

function successResponse(res, message, data = [], code = 200) {
    const response = {
        success: true,
    };

    if (message.length > 0) {
        response.message = message;
    }

    response.data = data;

    return res.status(code).json(response);
}

function generateRandomString(length = 8, prefix = "") {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + result;
}

const generateToken = (id) => {
    const jwt = require("jsonwebtoken");
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Get admin emails as an array
 * @returns {string[]} Array of admin email addresses
 */
const getAdminEmails = () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return [];
    return adminEmail.split(',').map(email => email.trim()).filter(Boolean);
};

/**
 * Get the first admin email (for backward compatibility)
 * @returns {string} First admin email address
 */
const getPrimaryAdminEmail = () => {
    const emails = getAdminEmails();
    return emails.length > 0 ? emails[0] : null;
};


/**
 * sendMail - send HTML email using EJS templates
 *
 * @param {string} to - recipient email
 * @param {string} subject - sender email
 * @param {string} templateName - e.g. 'alumniReceived'
 * @param {object} templateVars - variables to inject into the template
 */
async function sendMail(to, subject, templateName, templateVars) {
    console.log("========== sendMail() called ==========");
    console.log({
        to,
        subject,
        templateName,
        templateVars
    });
    try {
        const nodemailer = require("nodemailer");
        const ejs = require("ejs");
        const path = require("path");
        const dns = require("dns");

        // 1️⃣ Render HTML from EJS template
        const html = await ejs.renderFile(
            path.join(__dirname, `./mails/${templateName}.ejs`),
            templateVars
        );

        // 2️⃣ Create transporter
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = parseInt(process.env.SMTP_PORT);
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
        const fromEmail = process.env.FROM_EMAIL;

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
            const missing = [
                !smtpHost && "SMTP_HOST",
                !smtpPort && "SMTP_PORT",
                !smtpUser && "SMTP_USER",
                !smtpPass && "SMTP_PASS",
                !fromEmail && "FROM_EMAIL",
            ].filter(Boolean).join(", ");
            throw new Error(`SMTP configuration is missing: ${missing}`);
        }

        console.log("SMTP config", {
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            user: smtpUser ? smtpUser.replace(/(.{2}).+(@.+)/, "$1***$2") : null,
        });

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            lookup: (hostname, options, callback) => dns.lookup(hostname, { family: 4 }, callback),
            connectionTimeout: 20000,
            greetingTimeout: 20000,
            socketTimeout: 20000,
            tls: {
                rejectUnauthorized: false,
            },
            localAddress: "0.0.0.0",
        });

        // 3️⃣ Send email
        const info = await transporter.sendMail({
            from: `"${process.env.APP_NAME}" <${fromEmail}>`,
            to,
            subject: subject,
            html
        });

        console.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}


module.exports = { errorResponse, successResponse, generateRandomString, startServer, generateToken, sendMail, getAdminEmails, getPrimaryAdminEmail };