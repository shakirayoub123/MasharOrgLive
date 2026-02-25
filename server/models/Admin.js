const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    }
}, { timestamps: true });

// Method to generate JWT
adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { id: this._id, role: "admin" },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "24h" }
    );
    return token;
};

module.exports = mongoose.model("Admin", adminSchema);
