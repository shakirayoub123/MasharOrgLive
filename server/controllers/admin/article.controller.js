const Article = require("../../models/Article");
const fs = require("fs");
const mongoose = require("mongoose");
const BaseController = require("../base.controller");
const { mailer, notifyGlobally } = require("../../events/notifier");

class ArticleController extends BaseController {

    /**
     * @desc Get all articles (with pagination + search)
     */
    async getAllArticles(req, res) {
        try {
            const { page = 1, limit = 10, search = "" } = req.query;

            const query = {
                heading: { $regex: search, $options: "i" },
            };

            const articles = await Article.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .lean();

            const total = await Article.countDocuments(query);

            // ✅ Build base URL
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            // ✅ Transform file paths and add featured
            const transformedArticles = articles.map(article => ({
                ...article,
                cover_image: article.cover_image
                    ? `${baseUrl}/${article.cover_image.replace(/\\/g, "/")}`
                    : null,
                pdf_file: article.pdf_file
                    ? `${baseUrl}/${article.pdf_file.replace(/\\/g, "/")}`
                    : null,
                featured: article.featured || false, // ✅ Ensure featured is always present
            }));

            return this.success(res, "Articles fetched successfully", {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                data: transformedArticles,
            });

        } catch (error) {
            return this.error(res, error.message);
        }
    }

    /**
     * @desc Get single article
     */
    getArticleById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return this.error(res, "Invalid article ID", 400);
            }

            const article = await Article.findById(id).lean();

            if (!article) {
                return this.error(res, "Article not found", 404);
            }

            const baseUrl = `${req.protocol}://${req.get("host")}`;

            // ✅ Transform URLs and add featured
            const transformedArticle = {
                ...article,
                cover_image: article.cover_image
                    ? `${baseUrl}/${article.cover_image.replace(/\\/g, "/")}`
                    : null,
                pdf_file: article.pdf_file
                    ? `${baseUrl}/${article.pdf_file.replace(/\\/g, "/")}`
                    : null,
                featured: article.featured || false, // ✅ Ensure featured is always present
            };

            delete transformedArticle.__v;

            return this.success(res, "Article fetched successfully", transformedArticle);

        } catch (error) {
            return this.error(res, error.message);
        }
    }

    /**
     * @desc Create article
     */
    async createArticle(req, res) {
        try {
            const { heading, description } = req.body;

            if (!req.files?.cover_image || !req.files?.pdf_file) {
                return this.error(res, "Cover image and PDF file are required", 400);
            }

            const article = await Article.create({
                heading,
                description,
                cover_image: req.files.cover_image[0].path,
                pdf_file: req.files.pdf_file[0].path,
                featured: false, // ✅ New articles default to not featured
            });

            const baseUrl = `${req.protocol}://${req.get("host")}`;

            // ✅ Transform response
            const transformedArticle = {
                ...article.toObject(),
                cover_image: article.cover_image
                    ? `${baseUrl}/${article.cover_image.replace(/\\/g, "/")}`
                    : null,
                pdf_file: article.pdf_file
                    ? `${baseUrl}/${article.pdf_file.replace(/\\/g, "/")}`
                    : null,
                featured: article.featured || false,
            };

            await notifyGlobally("A new article has been published.", 'alumni/resourcessection');

            return this.success(res, "Article created successfully", transformedArticle, 200);

        } catch (error) {
            return this.error(res, error.message);
        }
    }

    /**
     * @desc Update article
     */
    async updateArticle(req, res) {
        try {
            const { id } = req.params;

            const article = await Article.findById(id);

            if (!article) {
                return this.error(res, "Article not found", 404);
            }

            const { heading, description } = req.body;

            if (heading) article.heading = heading;
            if (description) article.description = description;

            // Replace cover image
            if (req.files?.cover_image) {
                if (fs.existsSync(article.cover_image)) {
                    fs.unlinkSync(article.cover_image);
                }
                article.cover_image = req.files.cover_image[0].path;
            }

            // Replace PDF
            if (req.files?.pdf_file) {
                if (fs.existsSync(article.pdf_file)) {
                    fs.unlinkSync(article.pdf_file);
                }
                article.pdf_file = req.files.pdf_file[0].path;
            }

            await article.save();

            const baseUrl = `${req.protocol}://${req.get("host")}`;

            // ✅ Transform response with featured
            const transformedArticle = {
                ...article.toObject(),
                cover_image: article.cover_image
                    ? `${baseUrl}/${article.cover_image.replace(/\\/g, "/")}`
                    : null,
                pdf_file: article.pdf_file
                    ? `${baseUrl}/${article.pdf_file.replace(/\\/g, "/")}`
                    : null,
                featured: article.featured || false, // ✅ Preserve featured status
            };

            return this.success(res, "Article updated successfully", transformedArticle);

        } catch (error) {
            return this.error(res, error.message);
        }
    }

    /**
     * @desc Delete article
     */
    async deleteArticle(req, res) {
        try {
            const { id } = req.params;

            const article = await Article.findById(id);

            if (!article) {
                return this.error(res, "Article not found", 404);
            }

            if (fs.existsSync(article.cover_image)) {
                fs.unlinkSync(article.cover_image);
            }

            if (fs.existsSync(article.pdf_file)) {
                fs.unlinkSync(article.pdf_file);
            }

            await article.deleteOne();

            return this.success(res, "Article deleted successfully", {});

        } catch (error) {
            return this.error(res, error.message);
        }
    }

    /**
     * @desc Toggle article featured status
     */
    toggleFeatured = async (req, res) => {
        try {
            const { id } = req.params;
            const { featured } = req.body;

            // Validate featured is a boolean
            if (typeof featured !== "boolean") {
                return this.error(res, "Featured must be a boolean value");
            }

            const article = await Article.findByIdAndUpdate(
                id,
                { featured },
                { new: true }
            ).lean();

            if (!article) {
                return this.error(res, "Article not found");
            }

            const baseUrl = `${req.protocol}://${req.get("host")}`;

            // ✅ Transform response with featured
            const transformedArticle = {
                ...article,
                cover_image: article.cover_image
                    ? `${baseUrl}/${article.cover_image.replace(/\\/g, "/")}`
                    : null,
                pdf_file: article.pdf_file
                    ? `${baseUrl}/${article.pdf_file.replace(/\\/g, "/")}`
                    : null,
                featured: article.featured || false,
            };

            return this.success(
                res,
                featured ? "Article marked as featured" : "Article removed from featured",
                transformedArticle
            );
        } catch (error) {
            console.error("Toggle featured error:", error);
            return this.error(res, error);
        }
    };
}

module.exports = new ArticleController();