const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Alumni = require("../models/Alumni");

const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Get the token from Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Admin.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Attach user to request object for downstream controllers
        req.user = user;

        next(); // Allow the request to continue

    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = adminAuthMiddleware;