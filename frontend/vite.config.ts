import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/VetPMS",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (
              id.includes("react-router") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-router";
            }
            if (id.includes("@tanstack")) {
              return "vendor-query";
            }
            if (id.includes("tailwindcss")) {
              return "vendor-tailwind";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
