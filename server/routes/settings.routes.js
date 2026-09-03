const express = require("express");
const router = express.Router();
const Setting = require("../models/Setting");

router.get("/global-alert", async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: "global_alert" });
        if (setting) {
            return res.status(200).json({ success: true, data: setting.value });
        }
        return res.status(200).json({ success: true, data: { enabled: false, message: "" } });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
