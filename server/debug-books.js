require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("./models/Book");

async function debugBooks() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const books = await Book.find().select("heading cover_image");
        console.log("\n=== Books in Database ===\n");
        books.forEach((book, i) => {
            console.log(`${i + 1}. ${book.heading}`);
            console.log(`   cover_image: "${book.cover_image}"`);
            console.log(`   type: ${typeof book.cover_image}`);
            console.log();
        });

        // Test the getFileUrl function
        const getFileUrl = (path) => {
            if (!path) return null;
            const normalized = path.replace(/\\/g, "/");
            return `/api/${normalized.replace(/^\//, "")}`;
        };

        console.log("\n=== Resolved URLs ===\n");
        books.forEach((book, i) => {
            const resolved = getFileUrl(book.cover_image);
            console.log(`${i + 1}. ${book.heading}`);
            console.log(`   Resolved: "${resolved}"`);
            console.log();
        });

        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

debugBooks();
