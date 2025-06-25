import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    logLevel: "info",
    plugins: [plugin()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
            "^/api": {
                target: "http://localhost:8001/",
                secure: false,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
        port: 5173,
        host: true, // Allow external connections
        cors: true,
    },
});
