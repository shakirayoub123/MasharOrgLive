const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const Alumni = require("./models/Alumni");
require("dotenv").config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mashar");
        console.log("Connected to MongoDB");

        const adminEmail = "admin@mashar.com";
        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`Admin ${adminEmail} already exists`);
        } else {
            const admin = new Admin({ email: adminEmail });
            await admin.save();
            console.log(`Admin ${adminEmail} seeded successfully`);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
