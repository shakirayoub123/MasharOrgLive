const cors = require("cors");

const allowedOrigins = (process.env.CORS_ALLOWED || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isLocalDevOrigin = (origin) => {
    if (!origin) return false;

    const normalizedOrigin = origin.replace(/\/+$/, "");

    return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(normalizedOrigin);
};

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = origin.replace(/\/+$/, "");

        if (allowedOrigins.includes(normalizedOrigin) || isLocalDevOrigin(normalizedOrigin)) {
            return callback(null, true);
        }

        if (process.env.APP_ENV !== "production") {
            return callback(null, true);
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
};

module.exports = cors(corsOptions);