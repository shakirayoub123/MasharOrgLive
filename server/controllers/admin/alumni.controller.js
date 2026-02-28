const mongoose = require("mongoose");
const BaseController = require("../base.controller");
const AlumniPost = require("../../models/AlumniPost");
const Alumni = require("../../models/Alumni");
const PostLike = require("../../models/PostLike");
const PostComment = require("../../models/PostComment");
const { mailer, notify } = require("../../events/notifier");

class AlumniController extends BaseController {

    generateToken = (req, res) => {
        return this.success(res, 'Password reset token', {
            id: req.user._id,
            email: req.user.email,
            token: req.user.remember_token
        })
    }

    fetchAllPosts = async (req, res) => {
        try {
            const userId = req.user._id;

            // Pagination
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            // Fetch posts
            const posts = await AlumniPost.find({ isDeleted: false })
                .populate("author", "name avatar")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            // Get all post ids
            const postIds = posts.map(post => post._id);

            // Get likes of current user for these posts
            const userLikes = await PostLike.find({
                post: { $in: postIds },
                user: userId
            }).select("post");

            const likedPostIds = userLikes.map(like => like.post.toString());

            // load recent comments
            const comments = await PostComment.find({ post: { $in: postIds }, isDeleted: false })
                .populate("author", "full_name course")
                .sort({ createdAt: 1 })
                .lean();
            const commentsByPost = {};
            comments.forEach(c => {
                const k = c.post.toString();
                if (!commentsByPost[k]) commentsByPost[k] = [];
                commentsByPost[k].push(c);
            });

            // Attach isLiked and optional comments
            const updatedPosts = posts.map(post => ({
                ...post,
                isLiked: likedPostIds.includes(post._id.toString()),
                comments: commentsByPost[post._id.toString()] || []
            }));

            return res.status(200).json({
                success: true,
                page,
                count: updatedPosts.length,
                data: updatedPosts
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    }

    alumniList = async (req, res) => {
        try {
            const { status, search, account_status } = req.query;

            let filter = {};

            // ✅ Filter by account_status
            if (status) {
                filter.status = status;
            }

            if (account_status) {
                filter.account_status = account_status;
            }

            // ✅ Search by name, email, phone
            if (search) {
                filter.$or = [
                    { full_name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ];
            }

            const list = await Alumni.find(filter).select("-password");

            return this.success(res, "", list);

        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };

    approveOrReject = async (req, res) => {
        try {
            const { id, status } = req.params;

            const mongoose = require("mongoose");

            // ✅ Validate Mongo ID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return this.error(res, "Invalid Reference Id");
            }

            // ✅ Allow only approved/rejected
            const allowedStatus = ["approve", "reject"];

            if (!allowedStatus.includes(status)) {
                return this.error(res, "Invalid status selected");
            }

            let newStatus = status === "approve" ? "approved" : "rejected";

            const updated = await Alumni.findByIdAndUpdate(
                id,
                { account_status: newStatus },
                { new: true }
            ).select("-password");

            if (!updated) {
                return this.error(res, "Alumni not found");
            }

            this.informAlumniForTheAction(req, updated, newStatus);

            return this.success(res, "Status updated successfully", updated);

        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };

    informAlumniForTheAction(req, alumni, action) {

        const baseUrl = (req.get("origin") || process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");

        let url =
            action === "approved"
                ? `${baseUrl}/set-password?token=${alumni.remember_token}`
                : baseUrl;

        console.log("Final URL:", url);

        mailer.emit("sendEmail", {
            to: alumni.email,
            subject:
                action === "approved"
                    ? "Your Mashar Account Has Been Approved"
                    : "Update Regarding Your Mashar Account Application",
            templateName: `alumni_account_${action}`,
            data: {
                full_name: alumni.full_name,
                url: url,
            },
        });
    }

    alumniDelete = async (req, res) => {
        try {
            const { id } = req.params;

            await Alumni.findByIdAndDelete(id);

            res.json({ message: "Alumni deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };

    alumniInfo = async (req, res) => {
        try {
            const { id } = req.params;

            const mongoose = require("mongoose");

            // ✅ Validate ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return this.error(res, "Invalid ID");
            }

            const alumni = await Alumni.findById(id).select("-password");

            if (!alumni) {
                return this.error(res, "Alumni not found");
            }

            return this.success(res, "", alumni);

        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };

    updateAlumni = async (req, res) => {
        try {
            const { id } = req.params;
            const mongoose = require("mongoose");

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return this.error(res, "Invalid ID");
            }

            // Fields allowed to update
            const allowedFields = [
                "full_name",
                "course",
                "completion_status",
                "completion_year",
                "account_status",
                "bio",
                "city",
                "country"
            ];

            let updateData = {};

            // Only allow specific fields
            for (let key of allowedFields) {
                if (req.body[key] !== undefined) {
                    updateData[key] = req.body[key];
                }
            }

            const updated = await Alumni.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select("-password");

            if (!updated) {
                return this.error(res, "Alumni not found");
            }

            return this.success(res, "Alumni updated successfully", updated);

        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };

    getMembers = async (req, res) => {
        try {
            const alumni = await Alumni.find({ account_status: "approved" })
                .select("-password -remember_token")
                .sort({ full_name: 1 });
            return this.success(res, "", alumni);
        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };

    // ─── ALUMNI BADGE MANAGEMENT ────────────────────────────────────────────

    // ✅ Alumni: Request a badge
    requestBadge = async (req, res) => {
        try {
            const alumniId = req.user._id;
            const { badgeId } = req.body;

            if (!['pioneer', 'mentor', 'champion'].includes(badgeId)) {
                return this.error(res, "Invalid badge ID");
            }

            const alumni = await Alumni.findById(alumniId);
            if (!alumni) {
                return this.error(res, "Alumni not found");
            }

            // Check if badge request already exists
            const existingBadge = alumni.badges.find(b => b.badgeId === badgeId);

            if (existingBadge) {
                if (existingBadge.status === 'pending') {
                    return this.error(res, "Badge request already pending");
                }
                // If rejected, allow re-requesting
                if (existingBadge.status === 'rejected') {
                    existingBadge.status = 'pending';
                    existingBadge.requestedAt = new Date();
                    existingBadge.rejectedAt = null;
                    existingBadge.rejectedBy = null;
                }
                // If approved, can't re-request
                if (existingBadge.status === 'approved') {
                    return this.error(res, "Badge already approved");
                }
            } else {
                // Create new badge request
                alumni.badges.push({
                    badgeId,
                    status: 'pending',
                    requestedAt: new Date(),
                });
            }

            await alumni.save();

            return this.success(res, "Badge request submitted", alumni);

        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };

    // ✅ Alumni: Get their badge statuses
    getMyBadges = async (req, res) => {
        try {
            const alumniId = req.user._id;
            const alumni = await Alumni.findById(alumniId).select('badges');

            if (!alumni) {
                return this.error(res, "Alumni not found");
            }

            const BADGE_DEFS = {
                pioneer: { label: 'Pioneer', icon: '🚀' },
                mentor: { label: 'Mentor', icon: '🎓' },
                champion: { label: 'Champion', icon: '🏆' }
            };

            const badges = ['pioneer', 'mentor', 'champion'].map(badgeId => {
                const badge = alumni.badges.find(b => b.badgeId === badgeId);
                return {
                    id: badgeId,
                    ...BADGE_DEFS[badgeId],
                    status: badge?.status || 'not_requested',
                    requestedAt: badge?.requestedAt || null,
                    approvedAt: badge?.approvedAt || null,
                    rejectedAt: badge?.rejectedAt || null,
                    approved: badge?.status === 'approved'
                };
            });

            return this.success(res, "", badges);

        } catch (error) {
            console.error(error);
            return this.error(res, "Server error");
        }
    };

    // ✅ Admin: Get all pending badge requests
    getBadgeRequests = async (req, res) => {
        try {
            // Find alumni who have at least one badge request (pending, approved, or rejected)
            const alumniWithRequests = await Alumni.find({
                "badges": { $exists: true, $ne: [] }
            }).select("full_name email course avatar badges");

            // Flatten into a list of individual requests
            const requests = [];

            alumniWithRequests.forEach(al => {
                al.badges.forEach(b => {
                    requests.push({
                        alumniId: al._id,
                        name: al.full_name,
                        email: al.email,
                        course: al.course,
                        avatar: al.avatar,
                        badgeId: b.badgeId,
                        requestedAt: b.requestedAt,
                        approvedAt: b.approvedAt || null,
                        rejectedAt: b.rejectedAt || null,
                        approvedBy: b.approvedBy || null,
                        rejectedBy: b.rejectedBy || null,
                        status: b.status
                    });
                });
            });

            // Sort by status (pending first), then by date (newest first)
            requests.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(b.requestedAt) - new Date(a.requestedAt);
            });

            return res.status(200).json({ success: true, data: requests });

        } catch (error) {
            console.error("getBadgeRequests error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error fetching badge requests"
            });
        }
    };

    // ✅ Admin: Approve or reject badge request
    updateBadgeStatus = async (req, res) => {
        try {
            const { alumniId, badgeId, status } = req.params;
            const adminId = req.user._id;

            if (!['approved', 'rejected'].includes(status)) {
                return this.error(res, "Invalid status. Must be 'approved' or 'rejected'");
            }

            // Check if badge exists
            const Badge = require("../../models/Badge");
            const badgeTemplate = await Badge.findOne({ badgeId });
            if (!badgeTemplate) {
                return this.error(res, "Badge template not found");
            }

            // Validate mongo IDs
            if (!mongoose.Types.ObjectId.isValid(alumniId) || !mongoose.Types.ObjectId.isValid(adminId)) {
                return this.error(res, "Invalid ID format");
            }

            const alumni = await Alumni.findById(alumniId);
            if (!alumni) {
                return this.error(res, "Alumni not found");
            }

            // Find the specific badge in the array
            const badgeObj = alumni.badges.find(b => b.badgeId === badgeId);
            if (!badgeObj) {
                return this.error(res, "Badge request not found for this user");
            }

            // Update badge status
            badgeObj.status = status;

            if (status === 'approved') {
                badgeObj.approvedAt = new Date();
                badgeObj.approvedBy = adminId;
                badgeObj.rejectedAt = null;
                badgeObj.rejectedBy = null;
            } else if (status === 'rejected') {
                badgeObj.rejectedAt = new Date();
                badgeObj.rejectedBy = adminId;
                badgeObj.approvedAt = null;
                badgeObj.approvedBy = null;
            }

            await alumni.save();

            // Notify user
            const formattedBadgeName = badgeTemplate.name;
            const notifMessage = status === 'approved'
                ? `🎉 You have been awarded the ${formattedBadgeName} badge! Check your profile to download it.`
                : `Your request for the ${formattedBadgeName} badge was not approved at this time.`;

            await notify({
                model_id: alumni._id,
                message: notifMessage,
                action_link: "/alumni/profile",
                model_type: "Alumni"
            });

            return this.success(res, `Badge ${status} successfully`);

        } catch (error) {
            console.error("updateBadgeStatus error:", error);
            return this.error(res, "Server error updating badge status");
        }
    };
}

module.exports = new AlumniController();