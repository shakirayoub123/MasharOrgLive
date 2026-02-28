const Badge = require("../../models/Badge");
const Alumni = require("../../models/Alumni");
const BaseController = require("../base.controller");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

class BadgeController extends BaseController {

    // ─── GET ALL BADGES ─────────────────────────────────────
    getAllBadges = async (req, res) => {
        try {
            const { category, active } = req.query;
            
            const filter = {};
            if (category && category !== "all") filter.category = category;
            if (active !== undefined) filter.isActive = active === "true";

            const badges = await Badge.find(filter)
                .populate("createdBy", "full_name")
                .sort({ sortOrder: 1, createdAt: -1 })
                .lean();

            return this.success(res, "Badges fetched successfully", badges);

        } catch (error) {
            console.error("getAllBadges error:", error);
            return this.error(res, "Failed to fetch badges");
        }
    };

    // ─── CREATE NEW BADGE ──────────────────────────────────
    createBadge = async (req, res) => {
        try {
            const { name, description, badgeId, category, criteria, sortOrder } = req.body;
            const adminId = req.user._id || req.admin._id;

            if (!name || !description || !badgeId) {
                return this.error(res, "Name, description, and badge ID are required");
            }

            if (!req.file) {
                return this.error(res, "Badge image is required");
            }

            // Check if badgeId already exists
            const existingBadge = await Badge.findOne({ badgeId: badgeId.toLowerCase() });
            if (existingBadge) {
                return this.error(res, "Badge ID already exists");
            }

            const badge = await Badge.create({
                name: name.trim(),
                description: description.trim(),
                badgeId: badgeId.toLowerCase().trim(),
                image: `/uploads/badges/${req.file.filename}`,
                category: category || "achievement",
                criteria: criteria?.trim() || "",
                sortOrder: parseInt(sortOrder) || 0,
                createdBy: adminId
            });

            await badge.populate("createdBy", "full_name");

            return this.success(res, "Badge created successfully", badge, 201);

        } catch (error) {
            console.error("createBadge error:", error);
            
            // Clean up uploaded file if badge creation failed
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (unlinkError) {
                    console.error("Failed to delete uploaded file:", unlinkError);
                }
            }
            
            return this.error(res, "Failed to create badge");
        }
    };

    // ─── UPDATE BADGE ───────────────────────────────────────
    updateBadge = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, category, criteria, sortOrder, isActive } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return this.error(res, "Invalid badge ID");
            }

            const badge = await Badge.findById(id);
            if (!badge) {
                return this.error(res, "Badge not found", 404);
            }

            const updateData = {};
            if (name !== undefined) updateData.name = name.trim();
            if (description !== undefined) updateData.description = description.trim();
            if (category !== undefined) updateData.category = category;
            if (criteria !== undefined) updateData.criteria = criteria.trim();
            if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder);
            if (isActive !== undefined) updateData.isActive = isActive === true || isActive === "true";

            // Handle image update
            if (req.file) {
                // Delete old image
                const oldImagePath = path.join(__dirname, "../../uploads/badges", path.basename(badge.image));
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                } catch (deleteError) {
                    console.error("Failed to delete old badge image:", deleteError);
                }
                
                updateData.image = `/uploads/badges/${req.file.filename}`;
            }

            const updatedBadge = await Badge.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate("createdBy", "full_name");

            return this.success(res, "Badge updated successfully", updatedBadge);

        } catch (error) {
            console.error("updateBadge error:", error);
            
            // Clean up uploaded file if update failed
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (unlinkError) {
                    console.error("Failed to delete uploaded file:", unlinkError);
                }
            }
            
            return this.error(res, "Failed to update badge");
        }
    };

    // ─── DELETE BADGE ───────────────────────────────────────
    deleteBadge = async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return this.error(res, "Invalid badge ID");
            }

            const badge = await Badge.findById(id);
            if (!badge) {
                return this.error(res, "Badge not found", 404);
            }

            // Check if any alumni have this badge
            const alumniWithBadge = await Alumni.countDocuments({
                "badges.badgeId": badge.badgeId
            });

            if (alumniWithBadge > 0) {
                return this.error(res, `Cannot delete badge. ${alumniWithBadge} alumni have this badge. Deactivate it instead.`);
            }

            // Delete badge image
            const imagePath = path.join(__dirname, "../../uploads/badges", path.basename(badge.image));
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (deleteError) {
                console.error("Failed to delete badge image:", deleteError);
            }

            await Badge.findByIdAndDelete(id);

            return this.success(res, "Badge deleted successfully");

        } catch (error) {
            console.error("deleteBadge error:", error);
            return this.error(res, "Failed to delete badge");
        }
    };

    // ─── GET BADGE STATISTICS ──────────────────────────────
    getBadgeStats = async (req, res) => {
        try {
            const totalBadges = await Badge.countDocuments({ isActive: true });
            const totalRequests = await Alumni.aggregate([
                { $unwind: "$badges" },
                { $group: { _id: "$badges.status", count: { $sum: 1 } } }
            ]);

            const stats = {
                totalBadges,
                totalRequests: totalRequests.reduce((sum, item) => sum + item.count, 0),
                pendingRequests: totalRequests.find(item => item._id === "pending")?.count || 0,
                approvedRequests: totalRequests.find(item => item._id === "approved")?.count || 0,
                rejectedRequests: totalRequests.find(item => item._id === "rejected")?.count || 0
            };

            return this.success(res, "Badge statistics fetched successfully", stats);

        } catch (error) {
            console.error("getBadgeStats error:", error);
            return this.error(res, "Failed to fetch badge statistics");
        }
    };

    // ─── GET AVAILABLE BADGES FOR ALUMNI ───────────────────
    getAvailableBadges = async (req, res) => {
        try {
            const badges = await Badge.find({ isActive: true })
                .select("name description badgeId image category criteria")
                .sort({ sortOrder: 1, name: 1 })
                .lean();

            return this.success(res, "Available badges fetched successfully", badges);

        } catch (error) {
            console.error("getAvailableBadges error:", error);
            return this.error(res, "Failed to fetch available badges");
        }
    };
}

module.exports = new BadgeController();