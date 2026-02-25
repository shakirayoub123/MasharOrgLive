const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminProtect = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: "Token is no longer valid" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = adminProtect;
