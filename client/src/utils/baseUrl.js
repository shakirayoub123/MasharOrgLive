const getFallbackOrigin = () => {
    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin;
    }

    return "";
};

const isLocalOrigin = (origin) => {
    if (!origin) return false;

    const hostname = origin.replace(/^https?:\/\//i, "").split(":")[0];

    return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1"
    );
};

const normalizeOrigin = (value) => {
    if (!value) return null;

    try {
        if (value.startsWith("/")) {
            return getFallbackOrigin();
        }

        return new URL(value, getFallbackOrigin()).origin;
    } catch {
        return null;
    }
};

export function getSiteOrigin() {
    const currentOrigin = getFallbackOrigin();

    if (currentOrigin && isLocalOrigin(currentOrigin)) {
        return currentOrigin;
    }

    return (
        normalizeOrigin(import.meta.env.VITE_SOCKET_URL) ||
        normalizeOrigin(import.meta.env.VITE_API_URL) ||
        currentOrigin
    );
}

export function getApiBaseUrl() {
    const currentOrigin = getFallbackOrigin();

    if (import.meta.env.DEV && currentOrigin && isLocalOrigin(currentOrigin)) {
        return "/api";
    }

    const raw = import.meta.env.VITE_API_URL;

    if (raw) {
        if (raw.startsWith("/")) {
            return `${getSiteOrigin()}${raw.replace(/\/$/, "")}`;
        }

        return raw.replace(/\/$/, "");
    }

    const siteOrigin = getSiteOrigin();
    return siteOrigin ? `${siteOrigin}/api` : "/api";
}

export function getSocketUrl() {
    const currentOrigin = getFallbackOrigin();

    if (import.meta.env.DEV && currentOrigin && isLocalOrigin(currentOrigin)) {
        return currentOrigin;
    }

    const raw = import.meta.env.VITE_SOCKET_URL;

    if (raw) {
        if (raw.startsWith("/")) {
            return getSiteOrigin();
        }

        return raw.replace(/\/$/, "");
    }

    return getSiteOrigin();
}

export function getAssetBaseUrl() {
    if (import.meta.env.DEV) {
        const backendOrigin =
            normalizeOrigin(import.meta.env.VITE_PROXY_TARGET) ||
            normalizeOrigin(import.meta.env.VITE_API_URL);

        return backendOrigin || "http://localhost:5001";
    }

    return getSiteOrigin();
}

export function resolveAssetUrl(path) {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${getAssetBaseUrl()}${normalizedPath}`;
}
