const mongoose = require("mongoose");
const BaseController = require("../base.controller");
const AlumniPost = require("../../models/AlumniPost");
const Alumni = require("../../models/Alumni");
const PostLike = require("../../models/PostLike");
const PostComment = require("../../models/PostComment");
const ResourceLike = require("../../models/ResourceLike");
const Article = require("../../models/Article");
const Book = require("../../models/Book");
const Video = require("../../models/Videos");
const { notify, notifyGlobally } = require("../../events/notifier");

const getFileUrl = (path) => {
    if (!path) return null;
    const normalized = path.replace(/\\/g, "/");
    return `/api/${normalized.replace(/^\//, "")}`;
};

class AlumniController extends BaseController {

    // ─── helper: pull all @Names (including spaces) from a string ─────────────
    extractMentions = (text = "") => {
        const re = /@([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)(?=\s|$)/g;
        const mentions = [];
        let m;
        while ((m = re.exec(text)) !== null) {
            mentions.push(m[1].trim());
        }
        return [...new Set(mentions)];
    }

    // ─── helper: ensure every post has a valid author object ──────────────────
    // Admin-created posts have author: null (admin is in a different collection).
    // We fall back to the stored authorName field so the frontend never gets null.
    normalizeAuthor = (post) => {
        if (post.author) return post; // already fine
        return {
            ...post,
            author: {
                _id: post._id,
                full_name: post.authorName || "Mashar Admin",
                course: "Administration",
            },
        };
    }

    generateToken = (req, res) => {
        return this.success(res, 'Password reset token', {
            id: req.user._id,
            email: req.user.email,
            token: req.user.remember_token
        });
    }

    // ─── POSTS ───────────────────────────────────────────────────────────────

    fetchPosts = async (req, res) => {
        try {
            const userId = req.user._id;
            const { tab, page = 1, limit = 20 } = req.query;

            // ✅ Only show approved posts + user's own posts (any status)
            const filter = { 
                isDeleted: false,
                $or: [
                    { approvalStatus: "approved" },
                    { author: userId } // User can see their own posts regardless of status
                ]
            };
            if (tab && tab !== "all") filter.tab = tab;

            const skip = (page - 1) * limit;

            let posts = await AlumniPost.find(filter)
                .populate("author", "full_name course")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const postIds = posts.map(p => p._id);

            // determine which posts current user has liked
            const likes = await PostLike.find({
                post: { $in: postIds },
                user: userId
            }).select("post");
            const likedIds = likes.map(l => l.post.toString());

            // load comments for those posts
            const comments = await PostComment.find({
                post: { $in: postIds },
                isDeleted: false
            })
                .populate("author", "full_name course")
                .sort({ createdAt: 1 })
                .lean();

            const commentsByPost = {};
            comments.forEach(c => {
                const k = c.post.toString();
                if (!commentsByPost[k]) commentsByPost[k] = [];
                commentsByPost[k].push({
                    ...c,
                    mentions: c.mentions || this.extractMentions(c.content || "")
                });
            });

            posts = posts.map(p => {
                // ✅ Normalize null author before spreading — admin posts have no ref
                const normalized = this.normalizeAuthor(p);
                return {
                    ...normalized,
                    isLiked: likedIds.includes(p._id.toString()),
                    comments: commentsByPost[p._id.toString()] || [],
                    mentions: p.mentions || this.extractMentions(p.content || "")
                };
            });

            return res.status(200).json({
                success: true,
                page,
                count: posts.length,
                data: posts
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

    // ── createPost ────────────────────────────────────────────────────────────
    createPost = async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ success: false, message: "No body received. Ensure route uses upload.single('image') middleware." });
            }

            const { title, content, tab, commentsOpen } = req.body;

            const image = req.file
                ? `/uploads/images/${req.file.filename}`
                : null;

            const mentions = this.extractMentions(content);

            const post = await AlumniPost.create({
                author: req.user._id,
                title: title || undefined,
                content: content || undefined,
                image: image || undefined,
                tab: tab || "discussion",
                commentsOpen: commentsOpen === "false" ? false : true,
                mentions,
                approvalStatus: "pending" // ✅ Posts need admin approval
            });

            await post.populate("author", "full_name course");

            // ✅ Notify admin about new post awaiting approval
            const { notify } = require("../../events/notifier");
            const { getAdminEmails } = require("../../helpers");
            const Admin = require("../../models/Admin");
            
            const adminEmails = getAdminEmails();
            const admin = await Admin.findOne({ email: { $in: adminEmails } });
            if (admin) {
                await notify({
                    model_id: admin._id,
                    message: `New post from ${req.user.full_name} awaits approval: "${title || content?.substring(0, 50) || 'Untitled'}"`,
                    action_link: "/admin/discussion",
                    model_type: "Admin"
                });
            }

            // Notify mentioned users (but don't send global notification yet - wait for approval)
            if (mentions.length > 0) {
                const mentionedUsers = await Alumni.find({
                    full_name: { $in: mentions },
                    _id: { $ne: req.user._id }
                }).select("_id");

                for (const u of mentionedUsers) {
                    await notify({
                        model_id: u._id,
                        message: `${req.user.full_name} mentioned you in a post (pending approval).`,
                        action_link: "/alumni/discussion",
                        model_type: "Alumni"
                    });
                }
            }

            return res.status(201).json({ 
                success: true, 
                data: post,
                message: "Post submitted for approval. You'll be notified once it's reviewed."
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Could not create post" });
        }
    }

    commentOnPost = async (req, res) => {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            if (!content || !content.trim()) {
                return res.status(400).json({ success: false, message: "Comment cannot be empty" });
            }

            const post = await AlumniPost.findById(postId);
            if (!post || post.isDeleted) {
                return res.status(404).json({ success: false, message: "Post not found" });
            }

            const mentions = this.extractMentions(content);

            const comment = await PostComment.create({
                post: postId,
                author: req.user._id,
                content,
                mentions
            });

            await comment.populate("author", "full_name course");

            // Notify mentioned users in comments
            if (mentions.length > 0) {
                const mentionedUsers = await Alumni.find({
                    full_name: { $in: mentions },
                    _id: { $ne: req.user._id }
                }).select("_id");

                for (const u of mentionedUsers) {
                    await notify({
                        model_id: u._id,
                        message: `${req.user.full_name} mentioned you in a comment.`,
                        action_link: "/alumni/discussion",
                        model_type: "Alumni"
                    });
                }
            }

            // Notify post author if someone else commented
            // ✅ Guard: post.author may be null for admin-created posts
            if (post.author && post.author.toString() !== req.user._id.toString()) {
                await notify({
                    model_id: post.author,
                    message: `${req.user.full_name} commented on your post.`,
                    action_link: "/alumni/discussion",
                    model_type: "Alumni"
                });
            }

            await AlumniPost.updateOne(
                { _id: postId },
                { $inc: { commentsCount: 1 } }
            );

            return res.status(201).json({ success: true, data: comment });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Could not post comment" });
        }
    }

    likeThePost = async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const userId = req.user._id;
            const postId = req.params.postId;

            const post = await AlumniPost.findById(postId).session(session);
            if (!post || post.isDeleted) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ success: false, message: "Post not found" });
            }

            const existingLike = await PostLike.findOne({
                post: postId,
                user: userId
            }).session(session);

            let message;

            if (existingLike) {
                await PostLike.deleteOne({ _id: existingLike._id }).session(session);
                await AlumniPost.updateOne(
                    { _id: postId },
                    { $inc: { likesCount: -1 } }
                ).session(session);
                message = "Post unliked";
            } else {
                await PostLike.create([{ post: postId, user: userId }], { session });
                await AlumniPost.updateOne(
                    { _id: postId },
                    { $inc: { likesCount: 1 } }
                ).session(session);

                const likerName = req.user.full_name || "Someone";

                // ✅ Guard: only notify if post has a real alumni author (not null/admin)
                if (post.author) {
                    await notify({
                        model_id: post.author,
                        message: `${likerName} liked your post`,
                        action_link: "/alumni/discussion",
                        model_type: "Alumni",
                    });
                }
                message = "Post liked";
            }

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ success: true, message });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error(error);
            return res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }

    toggleResourceLike = async (req, res) => {
        try {
            const { resourceType, id } = req.params;
            const userId = req.user._id;
            const allowedTypes = {
                article: Article,
                book: Book,
                video: Video,
                course: require("../../models/Program"),
            };

            const Model = allowedTypes[resourceType];
            if (!Model) {
                return res.status(400).json({ success: false, message: "Invalid resource type" });
            }

            const resource = await Model.findById(id);
            if (!resource) {
                return res.status(404).json({ success: false, message: "Resource not found" });
            }

            if (resourceType === "video" && resource.isActive === false) {
                return res.status(403).json({ success: false, message: "Video is not available" });
            }

            const existing = await ResourceLike.findOne({
                resourceType,
                resourceId: id,
                user: userId,
            });

            if (existing) {
                await ResourceLike.deleteOne({ _id: existing._id });
                return res.status(200).json({ success: true, liked: false, message: "Resource unliked" });
            }

            await ResourceLike.create({ resourceType, resourceId: id, user: userId });
            return res.status(200).json({ success: true, liked: true, message: "Resource liked" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Could not toggle like" });
        }
    }

    getActivity = async (req, res) => {
        try {
            const userId = req.user._id;

            const [postLikes, resourceLikes] = await Promise.all([
                PostLike.find({ user: userId }).select("post").lean(),
                ResourceLike.find({ user: userId }).lean(),
            ]);

            const postIds = postLikes.map(l => l.post);
            const likedPostDocs = postIds.length > 0
                ? await AlumniPost.find({
                    _id: { $in: postIds },
                    isDeleted: false,
                    $or: [
                        { approvalStatus: "approved" },
                        { author: userId }
                    ]
                  })
                  .populate("author", "full_name course")
                  .sort({ createdAt: -1 })
                  .lean()
                : [];

            const mapIds = (type) => resourceLikes
                .filter(l => l.resourceType === type)
                .map(l => l.resourceId);

            const [articles, books, videos, courses] = await Promise.all([
                Article.find({ _id: { $in: mapIds("article") } }).lean(),
                Book.find({ _id: { $in: mapIds("book") } }).lean(),
                Video.find({ _id: { $in: mapIds("video") } }).lean(),
                require("../../models/Program").find({ _id: { $in: mapIds("course") } }).lean(),
            ]);

            const transform = (item, type) => ({ ...item, resourceType: type });

            return res.status(200).json({
                success: true,
                data: {
                    likedPosts: likedPostDocs.map(p => ({
                        ...p,
                        isLiked: true,
                        comments: p.comments || [],
                    })),
                    likedArticles: articles.map(a => ({
                        ...a,
                        resourceType: "article",
                    })),
                    likedBooks: books.map(b => ({
                        ...b,
                        resourceType: "book",
                    })),
                    likedVideos: videos.map(v => ({
                        ...v,
                        resourceType: "video",
                    })),
                    likedCourses: courses.map(c => ({
                        ...c,
                        resourceType: "course",
                    })),
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Could not fetch activity" });
        }
    }

    getLikeSummary = async (req, res) => {
        try {
            const userId = req.user._id;
            const likes = await ResourceLike.find({ user: userId }).lean();

            const grouped = likes.reduce((acc, like) => {
                acc[like.resourceType] = acc[like.resourceType] || [];
                acc[like.resourceType].push(like.resourceId.toString());
                return acc;
            }, {});

            const postLikes = await PostLike.find({ user: userId }).select("post").lean();
            grouped.post = postLikes.map(l => l.post.toString());

            return res.status(200).json({ success: true, data: grouped });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Could not fetch like summary" });
        }
    }

    // ─── BADGES ──────────────────────────────────────────────────────────────
    requestBadge = async (req, res) => {
        try {
            const { badgeId } = req.params;
            const alumniId = req.user._id;

            // Check if badge exists and is active
            const Badge = require("../../models/Badge");
            const badgeTemplate = await Badge.findOne({ badgeId, isActive: true });
            if (!badgeTemplate) {
                return res.status(404).json({ success: false, message: "Badge not found or not available" });
            }

            const alumni = await Alumni.findById(alumniId);
            if (!alumni) {
                return res.status(404).json({ success: false, message: "Alumni not found" });
            }

            if (!alumni.badges) alumni.badges = [];

            const existingBadge = alumni.badges.find(b => b.badgeId === badgeId);
            if (existingBadge) {
                if (existingBadge.status === "rejected") {
                    existingBadge.status = "pending";
                    existingBadge.requestedAt = Date.now();
                    await alumni.save();
                    return res.status(200).json({ success: true, message: "Badge requested again successfully", badges: alumni.badges });
                }
                return res.status(400).json({ success: false, message: "Badge already requested" });
            }

            alumni.badges.push({ badgeId, status: "pending" });
            await alumni.save();

            return res.status(200).json({ success: true, message: "Badge requested successfully", badges: alumni.badges });
        } catch (error) {
            console.error("requestBadge error:", error);
            return res.status(500).json({ success: false, message: "Could not request badge" });
        }
    }
}

module.exports = new AlumniController();