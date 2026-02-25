const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const alumniSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
            // Not required — alumni register without a password
        },
        phone: {
            type: String,
            trim: true,
        },
        batch: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        setPasswordToken: {
            type: String,
        },
        setPasswordExpires: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Hash password before saving
alumniSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
alumniSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Alumni", alumniSchema);
