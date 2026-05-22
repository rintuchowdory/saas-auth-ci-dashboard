import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";

// Manus runtime plugin only available in Manus environment
let manusRuntimePlugin: (() => any) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const m = require("vite-plugin-manus-runtime");
  manusRuntimePlugin = m.manusRuntimePlugin;
} catch {
  // Not available outside Manus — skip
}

// https://vitejs.dev/config/
export default defineConfig({
  // Support GitHub Pages subdirectory deployment via VITE_BASE_PATH env var
  base: process.env.VITE_BASE_PATH || "/",

  plugins: [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
    ...(manusRuntimePlugin ? [manusRuntimePlugin()] : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },

  root: "client",

  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          query: ["@tanstack/react-query"],
          charts: ["recharts"],
          ui: ["lucide-react", "framer-motion"],
        },
      },
    },
  },

  server: {
    host: true,
    port: 3000,
  },
});
