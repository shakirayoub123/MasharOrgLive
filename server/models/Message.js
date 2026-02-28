const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema(
    {
        conversation_id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true
        },

        sender_model: {
            type: String,
            enum: ["Alumni", "Admin"],
            required: true
        },

        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "senderModel"
        },

        message : {
            type: String,
            required: true,
            trim: true
        },

        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text"
        },

        read: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

// For fast history loading
messageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);