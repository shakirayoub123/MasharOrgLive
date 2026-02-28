const express = require("express");
const router = express.Router();
const controller = require("../controllers/alumni/alumni.controller");
const adminController = require("../controllers/admin/alumni.controller");
const { getEvents, getEventDetails, registerForEvent, unregisterFromEvent } = require("../controllers/alumni/event.controller");
const authMiddleware = require("../middlewares/alumni");
const alumniChatController = require("../controllers/alumni/chat.controller");
const alumniArticleController = require("../controllers/alumni/article.controller");
const alumniVideoController = require("../controllers/alumni/aluminivideo.controller");
const alumniBookController = require("../controllers/alumni/book.controller");
const { getActiveSpotlights } = require("../controllers/spotlight.controller");
const upload = require("../middlewares/upload");
const programsCtrl = require("../controllers/admin/Programs.controller");
const engagementCtrl = require("../controllers/alumni/Engagement.controller");
const eventRequestCtrl = require("../controllers/alumni/eventRequest.controller");
const contactRequestCtrl = require("../controllers/alumni/contactRequest.controller");
const notificationController = require("../controllers/alumni/notification.controller");

// ✅ Async error handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ✅ Apply auth middleware to ALL routes in this file
router.use(authMiddleware);

// ============================================
// POSTS/DISCUSSION APIs
// ============================================
router.get('/posts', asyncHandler(controller.fetchPosts));
router.post('/posts', upload.single("image"), asyncHandler(controller.createPost));
router.post('/posts/:postId/like', asyncHandler(controller.likeThePost));
router.post('/posts/:postId/comment', asyncHandler(controller.commentOnPost));

// Resource likes / activity
router.post('/resource/:resourceType/:id/like', asyncHandler(controller.toggleResourceLike));
router.get('/likes', asyncHandler(controller.getLikeSummary));
router.get('/activity', asyncHandler(controller.getActivity));

// ============================================
// PASSWORD RESET
// ============================================
router.get('/password_reset_token', asyncHandler(controller.generateToken));

// ============================================
// EVENT REQUESTS (MUST come before /events/:id to avoid param clash)
// ============================================
router.post("/events/request", asyncHandler(eventRequestCtrl.request));
router.get("/events/my-requests", asyncHandler(eventRequestCtrl.myRequests));

// ============================================
// EVENTS (NO DUPLICATES)
// ============================================
router.get("/events", asyncHandler(getEvents));
router.get("/events/:id", asyncHandler(getEventDetails));
router.post("/events/:id/register", asyncHandler(registerForEvent));
router.post("/events/:id/unregister", asyncHandler(unregisterFromEvent));

// ============================================
// CHAT/MESSAGING
// ============================================
router.get("/chat", asyncHandler(alumniChatController.loadConversation.bind(alumniChatController)));

// ============================================
// SPOTLIGHTS
// ============================================
router.get("/spotlights", asyncHandler(getActiveSpotlights));

// ============================================
// MEMBERS
// ============================================
router.get("/members", asyncHandler(adminController.getMembers));

// ============================================
// BADGES
// ============================================
router.get("/badges/available", asyncHandler(require("../controllers/admin/badge.controller").getAvailableBadges));
router.post("/badges/request/:badgeId", asyncHandler(controller.requestBadge));

// ============================================
// VIDEOS
// ============================================
router.get("/videos", asyncHandler(alumniVideoController.allVideos));
router.get("/videos/:id", asyncHandler(alumniVideoController.getInfo));

// ============================================
// ARTICLES (FIXED: all plural)
// ============================================
router.get("/articles", asyncHandler(alumniArticleController.getArticleList.bind(alumniArticleController)));
router.get("/articles/:id", asyncHandler(alumniArticleController.getArticleInfo.bind(alumniArticleController)));

// ============================================
// BOOKS (FIXED: all plural)
// ============================================
router.get("/books", asyncHandler(alumniBookController.getBookList.bind(alumniBookController)));
router.get("/books/:id", asyncHandler(alumniBookController.getBookInfo.bind(alumniBookController)));

// ============================================
// NOTIFICATIONS (FIXED: all plural and consistent)
// ============================================
router.get("/notifications", asyncHandler(notificationController.getNotifications.bind(notificationController)));
router.delete("/notifications/clear", asyncHandler(notificationController.clearAll.bind(notificationController)));
router.post("/notifications/:id/read", asyncHandler(notificationController.markAsRead.bind(notificationController)));
router.post("/notifications/read-all", asyncHandler(notificationController.markAllAsRead.bind(notificationController)));

// ============================================
// PROGRAMS & ENGAGEMENT
// ============================================
router.get("/programs", asyncHandler(programsCtrl.getAlumniPrograms));
router.get("/programs/progress", asyncHandler(programsCtrl.getAlumniProgress));
router.post("/programs/progress", asyncHandler(programsCtrl.toggleAlumniProgress));

router.get("/engage/my-submissions", asyncHandler(engagementCtrl.mySubmissions));
router.post("/engage/:type", asyncHandler(engagementCtrl.submit));

// ============================================
// CONTACT REQUESTS
// ============================================
router.post("/contact/request", asyncHandler(contactRequestCtrl.submit));
router.get("/contact/my-requests", asyncHandler(contactRequestCtrl.myRequests));

module.exports = router;