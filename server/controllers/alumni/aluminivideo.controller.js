const Video = require("../../models/Videos");
const BaseController = require("../base.controller");

class AlumniVideoController extends BaseController {
    constructor() {
        super(Video);
    }

    // ✅ Get Single Video Info (Alumni View Only)
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

            // Alumni can only view active videos
            if (!video.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "This video is not available",
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

    // ✅ Get All Videos (Pagination + Search) - Alumni View
    async allVideos(req, res) {
        try {
            let { page = 1, limit = 10, search = "" } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            // Alumni can only see active videos
            const query = { isActive: true };

            // 🔍 Search by heading
            if (search) {
                query.heading = { $regex: search, $options: "i" };
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
            console.log(error);
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new AlumniVideoController();