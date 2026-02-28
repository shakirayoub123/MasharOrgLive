const AlumniPost = require("../../models/AlumniPost");
const { notifyGlobally } = require("../../events/notifier");

class AdminPostController {

    // ─── Get All Posts ─────────────────────────────────────
    fetchAllPosts = async (req, res) => {
        try {
            const { page = 1, limit = 20, tab, status } = req.query;
            const filter = { isDeleted: false };
            if (tab && tab !== "all") filter.tab = tab;
            if (status && status !== "all") filter.approvalStatus = status;

            const skip = (page - 1) * limit;
            const posts = await AlumniPost.find(filter)
                .populate("author", "full_name course")
                .populate("approvedBy", "full_name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean();

            // ✅ For admin-created posts, author will be null after populate.
            // Inject the stored authorName so frontend always gets a valid object.
            const normalized = posts.map(p => {
                if (!p.author) {
                    p.author = {
                        _id: null,
                        full_name: p.authorName || "Mashar Admin",
                        course: "Administration",
                    };
                }
                return p;
            });

            const total = await AlumniPost.countDocuments(filter);
            return res.json({ success: true, total, page: parseInt(page), data: normalized });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to fetch posts" });
        }
    };

    // ─── Create Post (Admin) ───────────────────────────────
    createPost = async (req, res) => {
        try {
            const actor = req.user || req.admin;
            if (!actor) {
                return res.status(401).json({ success: false, message: "Unauthorized - no user context" });
            }

            const { title, content, tab, commentsOpen } = req.body;
            const image = req.file ? `/uploads/images/${req.file.filename}` : null;

            if (!title && !content && !image) {
                return res.status(400).json({ success: false, message: "Post must have title, content, or image" });
            }

            // ✅ KEY FIX: Do NOT set author: actor._id
            // The admin's _id lives in the Admin collection, NOT the Alumni collection.
            // Setting author: actor._id causes populate("author") to return null
            // because Mongoose looks in Alumni collection and finds nothing.
            //
            // Instead: leave author as null, store admin's display name in authorName.
            const post = await AlumniPost.create({
                // author: intentionally omitted — stays null in DB
                authorName: actor.full_name || actor.name || "Mashar Admin", // ✅ plain string fallback
                title,
                content,
                image,
                tab: tab || "discussion",
                commentsOpen: commentsOpen !== "false" && commentsOpen !== false,
                approvalStatus: "approved", // ✅ Admin posts are auto-approved
                approvedBy: actor._id,
                approvalDate: new Date()
            });

            // ✅ Build the response author object manually (no populate needed)
            const postObj = post.toObject();
            postObj.author = {
                _id: null,
                full_name: postObj.authorName || "Mashar Admin",
                course: "Administration",
            };

            await notifyGlobally("A new post has just been added. Check it out!", "/alumni/discussion");
            return res.status(201).json({ success: true, data: postObj });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to create post" });
        }
    };

    // ─── Update Post ───────────────────────────────────────
    updatePost = async (req, res) => {
        try {
            const { id } = req.params;

            if (!req.body) {
                return res.status(400).json({ success: false, message: "Request body is missing" });
            }

            const updateData = {};
            if (req.body.title !== undefined) updateData.title = req.body.title;
            if (req.body.content !== undefined) updateData.content = req.body.content;
            if (req.body.tab !== undefined) updateData.tab = req.body.tab;
            if (req.body.commentsOpen !== undefined) {
                updateData.commentsOpen = req.body.commentsOpen === true || req.body.commentsOpen === "true";
            }
            if (req.file) {
                updateData.image = `/uploads/images/${req.file.filename}`;
            }

            const post = await AlumniPost.findByIdAndUpdate(
                id, updateData, { returnDocument: "after", runValidators: true }
            ).populate("author", "full_name course").lean();

            if (!post) return res.status(404).json({ success: false, message: "Post not found" });

            // ✅ Same fallback for update response
            if (!post.author) {
                post.author = {
                    _id: null,
                    full_name: post.authorName || "Mashar Admin",
                    course: "Administration",
                };
            }

            return res.json({ success: true, data: post });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to update post" });
        }
    };

    // ─── Delete Post (Soft Delete) ─────────────────────────
    deletePost = async (req, res) => {
        try {
            const { id } = req.params;

            const post = await AlumniPost.findByIdAndUpdate(
                id, { isDeleted: true }, { returnDocument: "after" }
            );

            if (!post) return res.status(404).json({ success: false, message: "Post not found" });

            return res.json({ success: true, message: "Post deleted successfully" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to delete post" });
        }
    };

    // ─── Approve Post ──────────────────────────────────────
    approvePost = async (req, res) => {
        try {
            const { id } = req.params;
            const adminId = req.user._id || req.admin._id;

            const post = await AlumniPost.findByIdAndUpdate(
                id,
                {
                    approvalStatus: "approved",
                    approvedBy: adminId,
                    approvalDate: new Date()
                },
                { returnDocument: "after" }
            ).populate("author", "full_name course email");

            if (!post) {
                return res.status(404).json({ success: false, message: "Post not found" });
            }

            // ✅ Notify the author that their post was approved
            if (post.author) {
                const { notify } = require("../../events/notifier");
                await notify({
                    model_id: post.author._id,
                    message: `Your post "${post.title || 'Untitled'}" has been approved and is now visible to the community.`,
                    action_link: "/alumni/discussion",
                    model_type: "Alumni"
                });

                // ✅ Send global notification that new post is available
                const { notifyGlobally } = require("../../events/notifier");
                await notifyGlobally(`${post.author.full_name} shared a new post`, "/alumni/discussion");
            }

            return res.json({ success: true, message: "Post approved successfully", data: post });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to approve post" });
        }
    };

    // ─── Reject Post ───────────────────────────────────────
    rejectPost = async (req, res) => {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const adminId = req.user._id || req.admin._id;

            const post = await AlumniPost.findByIdAndUpdate(
                id,
                {
                    approvalStatus: "rejected",
                    approvedBy: adminId,
                    approvalDate: new Date(),
                    rejectionReason: reason || "Post does not meet community guidelines"
                },
                { returnDocument: "after" }
            ).populate("author", "full_name course email");

            if (!post) {
                return res.status(404).json({ success: false, message: "Post not found" });
            }

            // ✅ Notify the author that their post was rejected
            if (post.author) {
                const { notify } = require("../../events/notifier");
                await notify({
                    model_id: post.author._id,
                    message: `Your post "${post.title || 'Untitled'}" was not approved. Reason: ${post.rejectionReason}`,
                    action_link: "/alumni/discussion",
                    model_type: "Alumni"
                });
            }

            return res.json({ success: true, message: "Post rejected successfully", data: post });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to reject post" });
        }
    };

    // ─── Get Pending Posts (Moderation Queue) ─────────────
    getPendingPosts = async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            const skip = (page - 1) * limit;

            const posts = await AlumniPost.find({ 
                isDeleted: false, 
                approvalStatus: "pending" 
            })
                .populate("author", "full_name course email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean();

            const total = await AlumniPost.countDocuments({ 
                isDeleted: false, 
                approvalStatus: "pending" 
            });

            return res.json({ 
                success: true, 
                total, 
                page: parseInt(page), 
                data: posts 
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Failed to fetch pending posts" });
        }
    };
}

module.exports = new AdminPostController();