const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin/alumni.controller");
const authController = require("../controllers/alumni/auth.controller");
const articleController = require("../controllers/admin/article.controller");
const videoController = require("../controllers/admin/video.controller")
const AdminChatController = require("../controllers/admin/message.controller")
const upload = require("../middlewares/upload");
const programsCtrl = require("../controllers/admin/Programs.controller");
const uploadProgram = require("../middlewares/Uploadprogram");
const engagementCtrl = require("../controllers/alumni/Engagement.controller");
const eventRequestCtrl = require("../controllers/alumni/eventRequest.controller");

const adminAuthMiddleware = require("../middlewares/admin");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../uploads/programs");
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const progStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const progUpload = multer({
    storage: progStorage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require("../controllers/admin/event.controller");
const {
    getAllSpotlights,
    createSpotlight,
    updateSpotlight,
    deleteSpotlight,
} = require("../controllers/spotlight.controller");
const {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
} = require("../controllers/admin/book.controller");

const uploadEventImage = require("../middlewares/Uploadeventimage");
const uploadBadge = require("../middlewares/uploadBadge");
const postController = require("../controllers/admin/post.controller");
const badgeController = require("../controllers/admin/badge.controller");

router.use(adminAuthMiddleware);

router.put('/profile', authController.updateAdminProfile);

router.get('/alumni/list', controller.alumniList);

// discussion post management
router.get('/posts', postController.fetchAllPosts);
router.get('/posts/pending', postController.getPendingPosts); // ✅ Moderation queue
router.post('/posts', upload.single("image"), postController.createPost);
router.put('/posts/:id', upload.single("image"), postController.updatePost);
router.patch('/posts/:id/approve', postController.approvePost); // ✅ Approve post
router.patch('/posts/:id/reject', postController.rejectPost); // ✅ Reject post
router.delete('/posts/:id', postController.deletePost);

router.get('/alumni/list', controller.alumniList)
router.put('/alumni/:id/:status', controller.approveOrReject)
router.delete('/alumni/delete/:id', controller.alumniDelete)
router.get('/alumni/info/:id', controller.alumniInfo);
router.post('/alumni/:id/update', controller.updateAlumni);
router.post('/alumni/:id/:status', controller.approveOrReject);

// Alumni Badges Management
router.get('/badges/requests', controller.getBadgeRequests);
router.put('/badges/:alumniId/:badgeId/:status', controller.updateBadgeStatus);

// ✅ Badge Template Management
router.get('/badges', badgeController.getAllBadges);
router.post('/badges', uploadBadge.single("image"), badgeController.createBadge);
router.put('/badges/:id', uploadBadge.single("image"), badgeController.updateBadge);
router.delete('/badges/:id', badgeController.deleteBadge);
router.get('/badges/stats', badgeController.getBadgeStats);


// Article related routes
router.get("/articles", articleController.getAllArticles.bind(articleController));
router.get("/article/:id", articleController.getArticleById.bind(articleController));
router.post("/article/create", upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
]),
    articleController.createArticle.bind(articleController)
);
router.put("/article/update/:id", upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
]), articleController.updateArticle.bind(articleController)
);
router.patch("/article/:id/featured", articleController.toggleFeatured.bind(articleController));
router.delete("/article/delete/:id", articleController.deleteArticle.bind(articleController));


// SpotLight Routes
router.get("/spotlights", getAllSpotlights);
router.post("/spotlights", createSpotlight);
router.put("/spotlights/:id", updateSpotlight);
router.delete("/spotlights/:id", deleteSpotlight);

// Video Routes
router.get("/videos", videoController.allVideos);
router.post("/video", videoController.create);
router.get("/video/:id", videoController.getInfo);
router.put("/video/:id", videoController.update);
router.delete("/video/:id", videoController.delete);

// Messaging Routes
router.get("/conversations", AdminChatController.getAllConversations.bind(AdminChatController));
router.get("/conversation/:alumniId", AdminChatController.startConversation.bind(AdminChatController));
router.get("/chat/:conversationId", AdminChatController.loadConversation.bind(AdminChatController));

// ✅ Event Routes (unchanged)
router.post("/events", uploadEventImage.single("image"), createEvent);
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.put("/events/:id", uploadEventImage.single("image"), updateEvent);
router.delete("/events/:id", deleteEvent);

// ✅ Book Routes
router.post("/books", uploadEventImage.single("cover_image"), createBook);
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);
router.put("/books/:id", uploadEventImage.single("cover_image"), updateBook);
router.delete("/books/:id", deleteBook);

// Programs
router.get("/programs", programsCtrl.getAllPrograms);
router.post("/programs", programsCtrl.createProgram);

// Lessons (pdf / image — file upload) — MUST come before :programId routes
router.post("/programs/lessons/upload-combined", progUpload.any(), (req, res, next) => {
    console.log("DEBUG: Lesson Upload Combined Hit", { body: req.body, files: req.files?.map(f => f.fieldname) });
    next();
}, programsCtrl.uploadLessonFile);

// Legacy Resources (files) — MUST come before :programId routes
router.post("/programs/resources/upload", uploadProgram.single("file"), programsCtrl.uploadResource);
router.patch("/programs/resources/:fileId", programsCtrl.updateResource);
router.delete("/programs/resources/:fileId", programsCtrl.deleteResource);

// Program CRUD (parameterized)
router.patch("/programs/:programId", programsCtrl.updateProgram);
router.delete("/programs/:programId", programsCtrl.deleteProgram);

// Modules
router.post("/programs/:programId/modules", programsCtrl.createModule);
router.patch("/programs/:programId/modules/:moduleId", programsCtrl.updateModule);
router.post("/programs/:programId/modules/:moduleId", programsCtrl.updateModule);
router.delete("/programs/:programId/modules/:moduleId", programsCtrl.deleteModule);

// Sections
router.post("/programs/:programId/modules/:moduleId/sections", programsCtrl.createSection);
router.patch("/programs/:programId/modules/:moduleId/sections/:sectionId", programsCtrl.updateSection);
router.delete("/programs/:programId/modules/:moduleId/sections/:sectionId", programsCtrl.deleteSection);

// Lessons (text / video — JSON body)
router.post("/programs/:programId/modules/:moduleId/sections/:sectionId/lessons", programsCtrl.createLesson);
router.patch("/programs/:programId/modules/:moduleId/sections/:sectionId/lessons/:lessonId", progUpload.any(), programsCtrl.updateLesson);
router.delete("/programs/:programId/modules/:moduleId/sections/:sectionId/lessons/:lessonId", programsCtrl.deleteLesson);

// ⚠️  Typed convenience routes BEFORE /submissions/:id (avoid param clash)
router.get("/engage/stats", engagementCtrl.stats);
router.get("/engage/mentor-applications", engagementCtrl.getByType("mentor"));
router.get("/engage/volunteer-applications", engagementCtrl.getByType("volunteer"));
router.get("/engage/contributions", engagementCtrl.getByType("contribute"));
router.get("/engage/success-stories", engagementCtrl.getByType("success-story"));

// General list + single + status update + delete
router.get("/engage/submissions", engagementCtrl.getAll);
router.get("/engage/submissions/:id", engagementCtrl.getOne);
router.patch("/engage/submissions/:id/status", engagementCtrl.updateStatus);
router.delete("/engage/submissions/:id", engagementCtrl.remove);

// ✅ Alumni Event Session Requests — uses /event-requests prefix to avoid clash with /events/:id
router.get("/event-requests/stats", eventRequestCtrl.stats);
router.get("/event-requests", eventRequestCtrl.getAll);
router.get("/event-requests/:id", eventRequestCtrl.getOne);
router.patch("/event-requests/:id/status", eventRequestCtrl.updateStatus);
router.delete("/event-requests/:id", eventRequestCtrl.remove);

// ✅ Contact Requests (from alumni "Contact Us > Request Form")
const contactRequestCtrl = require("../controllers/alumni/contactRequest.controller");
router.get("/contact-requests/stats", contactRequestCtrl.stats);
router.get("/contact-requests", contactRequestCtrl.getAll);
router.patch("/contact-requests/:id/status", contactRequestCtrl.updateStatus);
router.delete("/contact-requests/:id", contactRequestCtrl.deleteRequest);

module.exports = router;