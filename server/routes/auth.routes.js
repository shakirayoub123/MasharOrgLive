const express = require("express");
const router = express.Router();
const controller = require("../controllers/alumni/auth.controller")
const authMiddleware = require("../middlewares/alumni")
const adminAuthMiddleware = require("../middlewares/admin")
const { uploadAvatar } = require("../controllers/alumni/auth.controller");
const rateLimit = require("express-rate-limit");

router.get('/alumni/info', authMiddleware, controller.info)
router.get('/admin/info', adminAuthMiddleware, controller.info)
router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/password', controller.legacyChangePassword)
router.post('/forgot-password', controller.recoverPassword)

router.post('/profile', authMiddleware, uploadAvatar, controller.updateProfile);
router.get('/profile', authMiddleware, controller.getProfile);

router.post('/password', authMiddleware, controller.changePassword);


router.post('/admin/init', controller.initAdminLogin)
router.post('/admin/otp', controller.validateAdminOtp)

module.exports = router;
