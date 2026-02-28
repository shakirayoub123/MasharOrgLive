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
    full_name :{
        type: String,
        required: true,
        trim: true,
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
    return jwt.sign(
        {id: this._id, role: "admin"},
        process.env.JWT_SECRET || "your_jwt_secret",
        {expiresIn: "24h"}
    );
};

module.exports = mongoose.model("Admin", adminSchema);
