const Program = require("../../models/Program");
const { LessonProgress } = require("../../models/Program");
const path = require("path");
const fs = require("fs");

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Build a public URL for an uploaded file.
// If you switch to S3/Cloudinary later, just change this function.
function buildFileUrl(req, filename) {
    return `${req.protocol}://${req.get("host")}/uploads/programs/${filename}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/programs
 * Return all programs with modules, sections, and lessons.
 */
exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.find().sort({ createdAt: 1 });
        res.json({ success: true, data: programs });
    } catch (err) {
        console.error("getAllPrograms:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * POST /api/admin/programs
 * Body: { icon, label }
 */
exports.createProgram = async (req, res) => {
    try {
        const { icon = "📁", label } = req.body;
        if (!label?.trim()) {
            return res.status(400).json({ success: false, message: "Program label is required." });
        }
        const program = await Program.create({ icon: icon.trim(), label: label.trim() });
        res.status(201).json({ success: true, data: program });
    } catch (err) {
        console.error("createProgram:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * PATCH /api/admin/programs/:programId
 * Body: { icon?, label? }
 */
exports.updateProgram = async (req, res) => {
    try {
        const { icon, label } = req.body;
        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        if (icon !== undefined) program.icon = icon.trim();
        if (label !== undefined) program.label = label.trim();
        await program.save();

        res.json({ success: true, data: program });
    } catch (err) {
        console.error("updateProgram:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * DELETE /api/admin/programs/:programId
 * Also deletes all uploaded files from disk.
 */
exports.deleteProgram = async (req, res) => {
    try {
        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        // Remove all lesson files from disk
        for (const mod of program.modules) {
            for (const sec of (mod.sections || [])) {
                for (const lesson of (sec.lessons || [])) {
                    if (lesson.filename) _deleteFileFromDisk(lesson.filename);
                }
            }
            // Legacy files cleanup
            for (const file of (mod.files || [])) {
                if (file.filename) _deleteFileFromDisk(file.filename);
            }
        }

        await program.deleteOne();
        res.json({ success: true, message: "Program deleted." });
    } catch (err) {
        console.error("deleteProgram:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// MODULES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/programs/:programId/modules
 * Body: { label }
 */
exports.createModule = async (req, res) => {
    try {
        const { label } = req.body;
        if (!label?.trim()) {
            return res.status(400).json({ success: false, message: "Module label is required." });
        }

        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        program.modules.push({ label: label.trim(), sections: [] });
        await program.save();

        const newModule = program.modules[program.modules.length - 1];
        res.status(201).json({ success: true, data: newModule });
    } catch (err) {
        console.error("createModule:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * PATCH /api/admin/programs/:programId/modules/:moduleId
 * Body: { label }
 */
exports.updateModule = async (req, res) => {
    try {
        const { label } = req.body;
        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(req.params.moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        if (label !== undefined) mod.label = label.trim();
        await program.save();

        res.json({ success: true, data: mod });
    } catch (err) {
        console.error("updateModule:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * DELETE /api/admin/programs/:programId/modules/:moduleId
 * Also deletes all lesson files in the module from disk.
 */
exports.deleteModule = async (req, res) => {
    try {
        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(req.params.moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        // Delete lesson files from disk
        for (const sec of (mod.sections || [])) {
            for (const lesson of (sec.lessons || [])) {
                if (lesson.filename) _deleteFileFromDisk(lesson.filename);
            }
        }
        for (const file of (mod.files || [])) {
            if (file.filename) _deleteFileFromDisk(file.filename);
        }

        mod.deleteOne();
        await program.save();

        res.json({ success: true, message: "Module deleted." });
    } catch (err) {
        console.error("deleteModule:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/programs/:programId/modules/:moduleId/sections
 * Body: { label }
 */
exports.createSection = async (req, res) => {
    try {
        const { label } = req.body;
        if (!label?.trim()) {
            return res.status(400).json({ success: false, message: "Section label is required." });
        }

        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(req.params.moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        mod.sections.push({ label: label.trim(), lessons: [] });
        await program.save();

        const newSection = mod.sections[mod.sections.length - 1];
        res.status(201).json({ success: true, data: newSection });
    } catch (err) {
        console.error("createSection:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * PATCH /api/admin/programs/:programId/modules/:moduleId/sections/:sectionId
 * Body: { label }
 */
exports.updateSection = async (req, res) => {
    try {
        const { label } = req.body;
        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(req.params.moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        const sec = mod.sections.id(req.params.sectionId);
        if (!sec) return res.status(404).json({ success: false, message: "Section not found." });

        if (label !== undefined) sec.label = label.trim();
        await program.save();

        res.json({ success: true, data: sec });
    } catch (err) {
        console.error("updateSection:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * DELETE /api/admin/programs/:programId/modules/:moduleId/sections/:sectionId
 */
exports.deleteSection = async (req, res) => {
    try {
        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(req.params.moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        const sec = mod.sections.id(req.params.sectionId);
        if (!sec) return res.status(404).json({ success: false, message: "Section not found." });

        // Delete lesson files from disk
        for (const lesson of (sec.lessons || [])) {
            if (lesson.filename) _deleteFileFromDisk(lesson.filename);
        }

        sec.deleteOne();
        await program.save();

        res.json({ success: true, message: "Section deleted." });
    } catch (err) {
        console.error("deleteSection:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/programs/:programId/modules/:moduleId/sections/:sectionId/lessons
 * Body: { label, type, text?, videoUrl? }
 * For text and video type lessons (no file upload needed).
 */
exports.createLesson = async (req, res) => {
    try {
        const { label, type = "text", text = "", videoUrl = "" } = req.body;
        if (!label?.trim()) {
            return res.status(400).json({ success: false, message: "Lesson label is required." });
        }

        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(req.params.moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        const sec = mod.sections.id(req.params.sectionId);
        if (!sec) return res.status(404).json({ success: false, message: "Section not found." });

        let finalType = type;
        if (text && videoUrl) finalType = "mixed";

        const lessonData = {
            label: label.trim(),
            type: finalType,
            text: text,
            videoUrl: videoUrl,
        };

        sec.lessons.push(lessonData);
        await program.save();

        const newLesson = sec.lessons[sec.lessons.length - 1];
        res.status(201).json({ success: true, data: newLesson });
    } catch (err) {
        console.error("createLesson:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * POST /api/admin/programs/lessons/upload
 * Multipart form: file, programId, moduleId, sectionId, label, type (pdf|image)
 * For PDF and image type lessons that require a file upload.
 */
exports.uploadLessonFile = async (req, res) => {
    try {
        const { programId, moduleId, sectionId, label, type, text, videoUrl } = req.body;
        if (!programId || !moduleId || !sectionId) {
            return res.status(400).json({ success: false, message: "programId, moduleId, and sectionId are required." });
        }

        const program = await Program.findById(programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        const sec = mod.sections.id(sectionId);
        if (!sec) return res.status(404).json({ success: false, message: "Section not found." });

        const lessonData = {
            label: label?.trim() || "Untitled Lesson",
            text: text || "",
            videoUrl: videoUrl || "",
        };

        if (req.files) {
            const allFiles = Object.values(req.files).flat();
            allFiles.forEach(f => {
                const fUrl = buildFileUrl(req, f.filename);
                if (f.mimetype.startsWith("image/")) {
                    lessonData.imageUrl = fUrl;
                    lessonData.imageName = f.originalname;
                    lessonData.imageFile = f.filename;
                } else if (f.mimetype === "application/pdf") {
                    lessonData.pdfUrl = fUrl;
                    lessonData.pdfName = f.originalname;
                    lessonData.pdfFile = f.filename;
                }
                // Legacy / fallback
                lessonData.url = fUrl;
                lessonData.filename = f.filename;
                lessonData.originalName = f.originalname;
                lessonData.mimetype = f.mimetype;
                lessonData.size = f.size;
            });
        }

        // Determine final type
        let finalType = type || "text";
        let hasImg = !!lessonData.imageUrl;
        let hasPdf = !!lessonData.pdfUrl;
        let hasTxt = !!lessonData.text;
        let hasVid = !!lessonData.videoUrl;

        let counts = [hasImg, hasPdf, hasTxt, hasVid].filter(Boolean).length;
        if (counts > 1) finalType = "mixed";
        else if (hasImg) finalType = "image";
        else if (hasPdf) finalType = "pdf";
        else if (hasVid) finalType = "video";
        else finalType = "text";

        lessonData.type = finalType;

        sec.lessons.push(lessonData);
        await program.save();

        const newLesson = sec.lessons[sec.lessons.length - 1];
        res.status(201).json({ success: true, data: newLesson });
    } catch (err) {
        console.error("uploadLessonFile:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * PATCH /api/admin/programs/:programId/modules/:moduleId/sections/:sectionId/lessons/:lessonId
 * Handles both JSON and Multipart (for updating files).
 */
exports.updateLesson = async (req, res) => {
    try {
        const { programId, moduleId, sectionId, lessonId } = req.params;
        const { label, text, videoUrl, type } = req.body;

        const program = await Program.findById(programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        const sec = mod.sections.id(sectionId);
        if (!sec) return res.status(404).json({ success: false, message: "Section not found." });

        const lesson = sec.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found." });

        if (label !== undefined) lesson.label = label.trim();
        if (text !== undefined) lesson.text = text;
        if (videoUrl !== undefined) lesson.videoUrl = videoUrl;

        if (req.files) {
            const allFiles = Object.values(req.files).flat();
            allFiles.forEach(f => {
                const fUrl = buildFileUrl(req, f.filename);
                if (f.mimetype.startsWith("image/")) {
                    if (lesson.imageFile) _deleteFileFromDisk(lesson.imageFile);
                    lesson.imageUrl = fUrl;
                    lesson.imageName = f.originalname;
                    lesson.imageFile = f.filename;
                } else if (f.mimetype === "application/pdf") {
                    if (lesson.pdfFile) _deleteFileFromDisk(lesson.pdfFile);
                    lesson.pdfUrl = fUrl;
                    lesson.pdfName = f.originalname;
                    lesson.pdfFile = f.filename;
                }
                lesson.url = fUrl;
                lesson.filename = f.filename;
                lesson.originalName = f.originalname;
                lesson.mimetype = f.mimetype;
                lesson.size = f.size;
            });
        }

        // Re-determine type
        let finalType = type || lesson.type;
        let hasImg = !!lesson.imageUrl;
        let hasPdf = !!lesson.pdfUrl;
        let hasTxt = !!lesson.text;
        let hasVid = !!lesson.videoUrl;
        let counts = [hasImg, hasPdf, hasTxt, hasVid].filter(Boolean).length;
        if (counts > 1) finalType = "mixed";
        else if (hasImg) finalType = "image";
        else if (hasPdf) finalType = "pdf";
        else if (hasVid) finalType = "video";
        else finalType = "text";
        lesson.type = finalType;

        await program.save();
        res.json({ success: true, data: lesson });
    } catch (err) {
        console.error("updateLesson:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * DELETE /api/admin/programs/:programId/modules/:moduleId/sections/:sectionId/lessons/:lessonId
 */
exports.deleteLesson = async (req, res) => {
    try {
        const program = await Program.findById(req.params.programId);
        if (!program) return res.status(404).json({ success: false, message: "Program not found." });

        const mod = program.modules.id(req.params.moduleId);
        if (!mod) return res.status(404).json({ success: false, message: "Module not found." });

        const sec = mod.sections.id(req.params.sectionId);
        if (!sec) return res.status(404).json({ success: false, message: "Section not found." });

        const lesson = sec.lessons.id(req.params.lessonId);
        if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found." });

        if (lesson.filename) _deleteFileFromDisk(lesson.filename);

        lesson.deleteOne();
        await program.save();

        res.json({ success: true, message: "Lesson deleted." });
    } catch (err) {
        console.error("deleteLesson:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY FILES (RESOURCES) — kept for backward compatibility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/programs/resources/upload
 * Multipart: file (PDF), programId, moduleId, title
 */
exports.uploadResource = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        const { programId, moduleId, title } = req.body;
        if (!programId || !moduleId) {
            return res.status(400).json({ success: false, message: "programId and moduleId are required." });
        }

        const program = await Program.findById(programId);
        if (!program) {
            return res.status(404).json({ success: false, message: "Program not found." });
        }

        const mod = program.modules.id(moduleId);
        if (!mod) {
            return res.status(404).json({ success: false, message: "Module not found." });
        }

        const fileUrl = buildFileUrl(req, req.file.filename);

        mod.files.push({
            title: title?.trim() || req.file.originalname.replace(/\.pdf$/i, "").replace(/[-_]/g, " "),
            originalName: req.file.originalname,
            filename: req.file.filename,
            url: fileUrl,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });

        await program.save();

        const newFile = mod.files[mod.files.length - 1];
        res.status(201).json({ success: true, data: newFile });
    } catch (err) {
        console.error("uploadResource:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * PATCH /api/admin/programs/resources/:fileId
 * Body: { title?, description? }
 * Searches all programs/modules to find the file by ID.
 */
exports.updateResource = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { fileId } = req.params;

        // Find which program+module owns this file
        const program = await Program.findOne({ "modules.files._id": fileId });
        if (!program) return res.status(404).json({ success: false, message: "File not found." });

        let foundFile = null;
        for (const mod of program.modules) {
            const f = (mod.files || []).find(f => f._id?.toString() === fileId);
            if (f) { foundFile = f; break; }
        }

        if (!foundFile) return res.status(404).json({ success: false, message: "File not found." });

        if (title !== undefined) foundFile.title = title.trim();
        if (description !== undefined) foundFile.description = description.trim();

        await program.save();
        res.json({ success: true, data: foundFile });
    } catch (err) {
        console.error("updateResource:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * DELETE /api/admin/programs/resources/:fileId
 * Searches all programs/modules to find and remove the file.
 */
exports.deleteResource = async (req, res) => {
    try {
        const { fileId } = req.params;

        const program = await Program.findOne({ "modules.files._id": fileId });
        if (!program) return res.status(404).json({ success: false, message: "File not found." });

        let filename = null;
        for (const mod of program.modules) {
            const idx = (mod.files || []).findIndex(f => f._id?.toString() === fileId);
            if (idx !== -1) {
                filename = mod.files[idx].filename;
                mod.files.splice(idx, 1);
                break;
            }
        }

        await program.save();
        if (filename) _deleteFileFromDisk(filename);

        res.json({ success: true, message: "File deleted." });
    } catch (err) {
        console.error("deleteResource:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ALUMNI (public read-only)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/alumni/programs
 * Returns programs with modules, sections, and lessons for alumni to view.
 */
exports.getAlumniPrograms = async (req, res) => {
    try {
        const programs = await Program.find().sort({ createdAt: 1 });
        res.json({ success: true, data: programs });
    } catch (err) {
        console.error("getAlumniPrograms:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * GET /api/alumni/programs/progress
 * Returns the list of completed lessons for the logged-in alumni.
 */
exports.getAlumniProgress = async (req, res) => {
    try {
        const alumniId = req.user?._id || req.user?.id;
        if (!alumniId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const progress = await LessonProgress.find({ alumniId }).lean();
        res.json({ success: true, data: progress });
    } catch (err) {
        console.error("getAlumniProgress:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * POST /api/alumni/programs/progress
 * Body: { lessonId }
 * Toggles a lesson as completed/not completed for the logged-in alumni.
 */
exports.toggleAlumniProgress = async (req, res) => {
    try {
        const alumniId = req.user?._id || req.user?.id;
        if (!alumniId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { lessonId } = req.body;
        if (!lessonId) return res.status(400).json({ success: false, message: "lessonId is required." });

        // Toggle: if exists → delete, if not exists → create
        const existing = await LessonProgress.findOne({ alumniId, lessonId });
        if (existing) {
            await existing.deleteOne();
            res.json({ success: true, message: "Progress removed.", completed: false });
        } else {
            await LessonProgress.create({ alumniId, lessonId });
            res.json({ success: true, message: "Progress saved.", completed: true });
        }
    } catch (err) {
        console.error("toggleAlumniProgress:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PRIVATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function _deleteFileFromDisk(filename) {
    if (!filename) return;
    try {
        const filepath = path.join(__dirname, "../../uploads/programs", filename);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    } catch (err) {
        console.warn("Could not delete file from disk:", filename, err.message);
    }
}