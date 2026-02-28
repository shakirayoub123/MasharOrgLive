const BaseController = require("../base.controller");
const Book = require("../../models/Book");

const getFileUrl = (path) => {
    if (!path) return null;
    const normalized = path.replace(/\\/g, "/");
    return `/api/${normalized.replace(/^\//, "")}`;
};

class BookController extends BaseController {
    getBookList = async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            const books = await Book.find()
                .select("cover_image heading author description amazonLink createdAt")
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .sort({ createdAt: -1 });

            const total = await Book.countDocuments();

            const data = books.map((book) => ({
                ...book.toObject(),
                cover_image: getFileUrl(book.cover_image),
            }));

            return this.success(res, '', {
                data,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            return this.error(res, error);
        }
    };

    getBookInfo = async (req, res) => {
        try {
            const { id } = req.params;

            const book = await Book.findById(id);

            if (!book) {
                return this.error(res, "Book not found");
            }

            const data = {
                ...book.toObject(),
                cover_image: getFileUrl(book.cover_image),
            };

            return this.success(res, '', { data });
        } catch (error) {
            console.log(error);
            return this.error(res, error);
        }
    };
}

module.exports = new BookController();