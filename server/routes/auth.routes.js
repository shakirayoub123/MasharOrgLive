const express = require("express");
const router = express.Router();
const controller = require("../controllers/alumni/auth.controller")
const authMiddleware = require("../middlewares/alumni")
const adminAuthMiddleware = require("../middlewares/admin")
const { uploadAvatar } = require("../controllers/alumni/auth.controller");
const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 requests per windowMs
    message: { success: false, message: "Too many registration attempts from this IP, please try again after an hour" },
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/alumni/info', authMiddleware, controller.info)
router.get('/admin/info', adminAuthMiddleware, controller.info)
router.post('/register', registerLimiter, controller.register)
router.post('/login', controller.login)
router.post('/password', controller.legacyChangePassword)
router.post('/forgot-password', controller.recoverPassword)

router.post('/profile',         authMiddleware, uploadAvatar, controller.updateProfile);
router.get('/profile', authMiddleware, controller.getProfile);

router.post('/password', authMiddleware, controller.changePassword);


router.post('/admin/init', controller.initAdminLogin)
router.post('/admin/otp', controller.validateAdminOtp)

module.exports = router;
