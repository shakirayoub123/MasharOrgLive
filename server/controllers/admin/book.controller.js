const Book = require("../../models/Book");
const fs = require("fs");
const path = require("path");
const {notifyGlobally} = require("../../events/notifier");

// @desc    Create a new book
// @route   POST /api/v1/admin/books
// @access  Admin
const createBook = async (req, res) => {
    try {
        const { heading, author, description, amazonLink } = req.body;

        if (!heading || !author || !description || !amazonLink) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a cover image." });
        }

        const cover_image = `uploads/images/${req.file.filename}`;

        const book = await Book.create({
            heading: heading.trim(),
            author: author.trim(),
            description: description.trim(),
            amazonLink: amazonLink.trim(),
            cover_image,
        });

        await notifyGlobally("A new video has been published.", "/alumni/resourcessection")

        return res.status(201).json({ message: "Book published successfully.", book });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("createBook error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Get all books
// @route   GET /api/v1/admin/books
// @access  Admin
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.status(200).json({ books });
    } catch (error) {
        console.error("getAllBooks error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Get single book
// @route   GET /api/v1/admin/books/:id
// @access  Admin
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found." });
        return res.status(200).json({ book });
    } catch (error) {
        console.error("getBookById error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Update a book
// @route   PUT /api/v1/admin/books/:id
// @access  Admin
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Book not found." });
        }

        const { heading, author, description, amazonLink } = req.body;

        if (heading)     book.heading     = heading.trim();
        if (author)      book.author      = author.trim();
        if (description) book.description = description.trim();
        if (amazonLink)  book.amazonLink  = amazonLink.trim();

        if (req.file) {
            const oldImagePath = path.join(process.cwd(), book.cover_image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            book.cover_image = `uploads/images/${req.file.filename}`;
        }

        await book.save();
        return res.status(200).json({ message: "Book updated successfully.", book });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("updateBook error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// @desc    Delete a book
// @route   DELETE /api/v1/admin/books/:id
// @access  Admin
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found." });

        const imagePath = path.join(process.cwd(), book.cover_image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        await book.deleteOne();
        return res.status(200).json({ message: "Book deleted successfully." });
    } catch (error) {
        console.error("deleteBook error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBook };