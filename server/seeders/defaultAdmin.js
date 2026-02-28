const mongoose = require("mongoose");
const Admin = require("../models/Admin");
require("dotenv").config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        // ✅ Support comma-separated admin emails
console.log("Raw ADMIN_EMAIL:", JSON.stringify(process.env.ADMIN_EMAIL));

const adminEmails = process.env.ADMIN_EMAIL
  .split(",")
  .map(email => email.trim());

console.log("Parsed emails:", adminEmails);
console.log("Count:", adminEmails.length);
        const adminName = process.env.ADMIN_NAME;

        for (const adminEmail of adminEmails) {
            const existingAdmin = await Admin.findOne({ email: adminEmail });

            if (existingAdmin) {
                console.log(`Admin ${adminEmail} already exists`);
            } else {
                const admin = new Admin({
                    email: adminEmail,
                    full_name: adminName
                });
                await admin.save();
                console.log(`Admin ${adminEmail} seeded successfully`);
            }
        }

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin().then().catch().finally();
