import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./frontend/src/test/setup.tsx"],
    include: ["frontend/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules/", "frontend/src/test/"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/"],
    },
    silent: true,
    reporters: ["default"],
    testTimeout: 10000,
    hookTimeout: 10000,
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
