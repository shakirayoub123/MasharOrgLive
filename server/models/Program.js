const mongoose = require("mongoose");

// ─── Lesson Schema (embedded in section) ──────────────────────────────────────
const LessonSchema = new mongoose.Schema(
    {
        label:    { type: String, required: true, trim: true },
        type:     { type: String, enum: ["text", "pdf", "image", "video", "mixed"], default: "text" },
        // Combined content fields
        text:     { type: String, default: "" },
        videoUrl: { type: String, default: "" },
        
        // Image file
        imageUrl:     { type: String, default: "" },
        imageName:    { type: String, default: "" },
        imageFile:    { type: String, default: "" }, // disk filename
        
        // PDF file
        pdfUrl:       { type: String, default: "" },
        pdfName:      { type: String, default: "" },
        pdfFile:      { type: String, default: "" }, // disk filename
        
        // For backward compatibility / generic
        url:          { type: String, default: "" },
        originalName: { type: String, default: "" },
        filename:     { type: String, default: "" },
        mimetype:     { type: String, default: "" },
        size:         { type: Number, default: 0 },
    },
    { timestamps: true }
);

// ─── Section Schema (embedded in module) ──────────────────────────────────────
const SectionSchema = new mongoose.Schema(
    {
        label:   { type: String, required: true, trim: true },
        lessons: [LessonSchema],
    },
    { timestamps: true }
);

// ─── Module Schema (embedded in program) ──────────────────────────────────────
const ModuleSchema = new mongoose.Schema(
    {
        label:    { type: String, required: true, trim: true },
        sections: [SectionSchema],
        // Keep old files array for backward compatibility (optional)
        files:    { type: Array, default: [] },
    },
    { timestamps: true }
);

// ─── Program Schema ───────────────────────────────────────────────────────────
const ProgramSchema = new mongoose.Schema(
    {
        icon:    { type: String, default: "📁" },
        label:   { type: String, required: true, trim: true },
        modules: [ModuleSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Program", ProgramSchema);

// ─── Lesson Progress (separate collection for alumni tracking) ────────────────
const LessonProgressSchema = new mongoose.Schema(
    {
        alumniId:  { type: mongoose.Schema.Types.ObjectId, ref: "Alumni", required: true },
        lessonId:  { type: String, required: true },
        programId: { type: String, default: "" },
    },
    { timestamps: true }
);

LessonProgressSchema.index({ alumniId: 1, lessonId: 1 }, { unique: true });

const LessonProgress = mongoose.model("LessonProgress", LessonProgressSchema);
module.exports.LessonProgress = LessonProgress;