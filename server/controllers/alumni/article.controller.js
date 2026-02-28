const BaseController = require("../base.controller");
const Article = require("../../models/Article");

const getFileUrl = (path) => {
    if (!path) return null;
    const normalized = path.replace(/\\/g, "/"); 
    return `/api/${normalized.replace(/^\//, "")}`;
};

class ArticleController extends BaseController {
    getArticleList = async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query;

            const articles = await Article.find()
                .select("cover_image heading description createdAt featured pdf_file")
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .sort({ createdAt: -1 });

            const total = await Article.countDocuments();

            const data = articles.map((article) => ({
                ...article.toObject(),
                cover_image: getFileUrl(article.cover_image),
                pdf_file: getFileUrl(article.pdf_file),
                featured: article.featured,
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

    getArticleInfo = async (req, res) => {
        try {
            const { id } = req.params;

            const article = await Article.findById(id);

            if (!article) {
                return this.error(res, "Article not found");
            }

            const data = {
                ...article.toObject(),
                cover_image: getFileUrl(article.cover_image),
                pdf_file: getFileUrl(article.pdf_file),
                featured: article.featured, // ✅ Include featured status from DB
            };

            return this.success(res, '', { data });
        } catch (error) {
            console.log(error);
            return this.error(res, error);
        }
    };
}

module.exports = new ArticleController();