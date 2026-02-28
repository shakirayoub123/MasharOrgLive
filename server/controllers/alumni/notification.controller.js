// ─── BACKEND: Add clearAll method to NotificationController ──────────────────
// Add this method to the NotificationController class, then wire up the route.

const BaseController = require("../base.controller");
const Notification = require("../../models/Notification");
const NotificationRead = require("../../models/NotificationRead");

class NotificationController extends BaseController {

    getNotifications = async (req, res) => {
        try {
            const notifications = await Notification.find({
                $or: [
                    { notifiable_id: req.user._id },
                    { channel: "alumni" },
                ],
            }).sort({ createdAt: -1 });

            const readRecords = await NotificationRead.find({
                user_id: req.user._id,
                notification_id: { $in: notifications.map(n => n._id) },
            });
            const readSet = new Set(readRecords.map(r => r.notification_id.toString()));

            // ✅ Filter out notifications this user has cleared
            const clearedSet = new Set(
                readRecords
                    .filter(r => r.cleared === true)
                    .map(r => r.notification_id.toString())
            );

            const data = notifications
                .filter(n => {
                    // Always show personal notifications that aren't cleared
                    if (n.notifiable_id?.toString() === req.user._id.toString()) {
                        return !clearedSet.has(n._id.toString());
                    }
                    // For global alumni notifications, hide if this user cleared them
                    if (n.channel === "alumni") {
                        return !clearedSet.has(n._id.toString());
                    }
                    return true;
                })
                .map(n => ({
                    ...n.toObject(),
                    read: n.channel === "alumni"
                        ? readSet.has(n._id.toString())
                        : n.read,
                }));

            return this.success(res, "", data);
        } catch (err) {
            return this.error(res, err.message);
        }
    };

    markAsRead = async (req, res) => {
        try {
            const notification = await Notification.findById(req.params.id);

            if (!notification) {
                return this.error(res, "Notification not found", 404);
            }

            if (notification.channel === "alumni") {
                await NotificationRead.findOneAndUpdate(
                    { notification_id: notification._id, user_id: req.user._id },
                    { read_at: new Date() },
                    { upsert: true, returnDocument: "after" }
                );
            } else {
                await Notification.findOneAndUpdate(
                    { _id: req.params.id, notifiable_id: req.user._id },
                    { read: true, read_at: new Date() },
                    { returnDocument: "after" }
                );
            }

            return this.success(res, "Notification marked as read", {});
        } catch (err) {
            return this.error(res, err.message);
        }
    };

    markAllAsRead = async (req, res) => {
        try {
            await Notification.updateMany(
                { notifiable_id: req.user._id, read: false },
                { read: true, read_at: new Date() }
            );

            const alumniNotifications = await Notification.find({ channel: "alumni" });

            const bulkOps = alumniNotifications.map(n => ({
                updateOne: {
                    filter: { notification_id: n._id, user_id: req.user._id },
                    update: { read_at: new Date() },
                    upsert: true,
                },
            }));

            if (bulkOps.length > 0) {
                await NotificationRead.bulkWrite(bulkOps);
            }

            return this.success(res, "All notifications marked as read", {});
        } catch (err) {
            return this.error(res, err.message);
        }
    };

    // ✅ NEW: Clear all notifications for this alumni
    // - Personal notifications (notifiable_id = user): hard delete from DB
    // - Global/alumni notifications (channel = "alumni"): mark as cleared in
    //   NotificationRead so other users are NOT affected
    clearAll = async (req, res) => {
        try {
            const userId = req.user._id;

            // 1. Hard delete personal notifications (belong only to this user)
            await Notification.deleteMany({
                notifiable_id: userId,
            });

            // 2. For global alumni notifications — mark as cleared per-user
            //    We use the existing NotificationRead collection with a new `cleared` flag.
            //    This way other alumni still see these notifications.
            const alumniNotifications = await Notification.find({ channel: "alumni" });

            if (alumniNotifications.length > 0) {
                const bulkOps = alumniNotifications.map(n => ({
                    updateOne: {
                        filter: { notification_id: n._id, user_id: userId },
                        update: {
                            cleared: true,
                            cleared_at: new Date(),
                            read_at: new Date(), // also mark as read
                        },
                        upsert: true,
                    },
                }));
                await NotificationRead.bulkWrite(bulkOps);
            }

            return this.success(res, "All notifications cleared", {});
        } catch (err) {
            return this.error(res, err.message);
        }
    };
}

module.exports = new NotificationController();