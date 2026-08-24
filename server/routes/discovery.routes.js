const express = require("express");
const router = express.Router();
const discoveryController = require("../controllers/discovery.controller");

router.post("/", discoveryController.submitForm);
router.get("/", discoveryController.getInteractions);
router.delete("/:id", discoveryController.deleteInteraction);

module.exports = router;
