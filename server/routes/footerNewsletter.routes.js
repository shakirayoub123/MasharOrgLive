const express = require("express");
const router = express.Router();
const controller = require("../controllers/footerNewsletter.controller");
const adminAuthMiddleware = require("../middlewares/admin");

// Public
router.post("/subscribe", controller.subscribe);

// Admin protected
router.get("/", adminAuthMiddleware, controller.getAll);
router.delete("/:id", adminAuthMiddleware, controller.deleteSubscriber);

module.exports = router;

