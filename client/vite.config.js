/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: "/",
    plugins: [react()],
    server: {
        // Only enable the dev proxy when running in development locally.
        // This block will not affect production builds or the hosted app.
        proxy: process.env.NODE_ENV !== "production" ? {
            "/api": {
                target: process.env.VITE_API_URL || "http://localhost:5001",
                changeOrigin: true,
            },
        } : undefined,
    },
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom", "react-router-dom"],
                    ui: ["lucide-react", "framer-motion", "react-icons", "react-slick", "slick-carousel"],
                    calendar: ["@fullcalendar/react", "@fullcalendar/daygrid", "@fullcalendar/timegrid", "@fullcalendar/interaction", "react-big-calendar"],
                    utils: ["axios", "date-fns"],
                    editor: ["@tinymce/tinymce-react"]
                },
            },
        },
    },
});
