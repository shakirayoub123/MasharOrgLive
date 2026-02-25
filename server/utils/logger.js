const ActivityLog = require("../models/ActivityLog");

/**
 * Log a system or administrative activity
 * @param {Object} params
 * @param {String} params.type - registration, approval, rejection, support_message, admin_login, system
 * @param {String} params.title - Short title of the event
 * @param {String} params.description - Detailed description
 * @param {String} [params.performedBy] - ID of the admin who performed the action
 * @param {String} [params.relatedAlumni] - ID of the related alumni
 * @param {Object} [params.metadata] - Additional context
 */
const logActivity = async ({ type, title, description, performedBy, relatedAlumni, metadata }) => {
    try {
        const log = new ActivityLog({
            type,
            title,
            description,
            performedBy,
            relatedAlumni,
            metadata
        });
        await log.save();
        console.log(`[ActivityLog] ${type.toUpperCase()}: ${title}`);
        return log;
    } catch (error) {
        console.error("❌ Failed to log activity:", error.message);
    }
};

module.exports = { logActivity };
