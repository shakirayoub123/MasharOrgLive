const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: [true, "Heading is required"],
            trim: true,
            maxlength: [200, "Heading cannot exceed 200 characters"],
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        videoId: {
            type: String,
            required: [true, "Video ID is required"],
            trim: true,
        },

        youtubeUrl: {
            type: String,
            required: [true, "YouTube URL is required"],
            trim: true,
            validate: {
                validator: function (value) {
                    const youtubeRegex =
                        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
                    return youtubeRegex.test(value);
                },
                message: "Invalid YouTube URL",
            },
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


// 🔹 Auto extract videoId from youtubeUrl before saving
// videoSchema.pre("validate", function (next) {
//     if (this.youtubeUrl && !this.videoId) {
//         const match = this.youtubeUrl.match(
//             /(?:v=|\/)([0-9A-Za-z_-]{11}).*/
//         );
//         if (match) {
//             this.videoId = match[1];
//         }
//     }
//
//     next();
// });


module.exports = mongoose.model("Video", videoSchema);