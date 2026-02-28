const Video = require("../..//models/Videos");
const BaseController = require("../base.controller");
const {notify, notifyGlobally} = require("../../events/notifier");

class VideoController extends BaseController {
    constructor() {
        super(Video);
    }

    // ✅ Create Video
    async create(req, res) {
        try {
            const { heading, description, youtubeUrl, videoId } = req.body;

            const video = await Video.create({
                heading,
                description,
                youtubeUrl,
                videoId,
            });

            await notifyGlobally("A new video has been published.", "/alumni/resourcessection")

            return res.status(201).json({
                success: true,
                message: "Video created successfully",
                data: video,
            });
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ✅ Get Single Video Info
    async getInfo(req, res) {
        try {
            const { id } = req.params;

            const video = await Video.findById(id);

            if (!video) {
                return res.status(404).json({
                    success: false,
                    message: "Video not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: video,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ✅ Update Video
    async update(req, res) {
        try {
            const { id } = req.params;

            const updatedVideo = await Video.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedVideo) {
                return res.status(404).json({
                    success: false,
                    message: "Video not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Video updated successfully",
                data: updatedVideo,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ✅ Delete Video (Hard Delete)
    async delete(req, res) {
        try {
            const { id } = req.params;

            const deletedVideo = await Video.findByIdAndDelete(id);

            if (!deletedVideo) {
                return res.status(404).json({
                    success: false,
                    message: "Video not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Video deleted successfully",
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ✅ Get All Videos (Pagination + Search)
    async allVideos(req, res) {
        try {
            let { page = 1, limit = 10, search = "", isActive } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const query = {};

            // 🔍 Search by heading
            if (search) {
                query.heading = { $regex: search, $options: "i" };
            }

            // 🔹 Optional active filter
            if (isActive !== undefined) {
                query.isActive = isActive === "true";
            }

            const total = await Video.countDocuments(query);

            const videos = await Video
                .find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            return res.status(200).json({
                success: true,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                data: videos,
            });

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new VideoController();