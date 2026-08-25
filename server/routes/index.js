const authRoutes = require("./auth.routes");
const alumniRoutes = require("./alumni.routes");
const adminRoutes = require("./admin.routes");
const subscriberRoutes = require("./subscriber.routes");
const discoveryRoutes = require("./discovery.routes");

module.exports = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/alumni", alumniRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/subscribers", subscriberRoutes);
    app.use("/api/discovery", discoveryRoutes);
    app.use("/api/v1/admin", adminRoutes); // support legacy /api/v1/admin paths from frontend
};