const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriber.controller");
const adminAuthMiddleware = require("../middlewares/admin");

// Public route for subscription signup
router.post("/subscribe", controller.subscribe);

// Admin-only management routes
router.get("/", adminAuthMiddleware, controller.getAll);
router.delete("/:id", adminAuthMiddleware, controller.deleteSubscriber);

module.exports = router;
