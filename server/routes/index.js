const authRoutes = require("./auth.routes");
const alumniRoutes = require("./alumni.routes");
const adminRoutes = require("./admin.routes");
const subscriberRoutes = require("./subscriber.routes");
const discoveryRoutes = require("./discovery.routes");
const publicRoutes = require("./public.routes");

module.exports = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/alumni", alumniRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/subscribers", subscriberRoutes);
    app.use("/api/discovery", discoveryRoutes);
    app.use("/api/public", publicRoutes);          // ← no auth, public website
    app.use("/api/v1/admin", adminRoutes);           // legacy support
};