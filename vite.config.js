import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = env.VITE_BASE_PATH || "/";

  return {
  base: basePath,
  server: {
    proxy: {},
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // ఆటోమేటిక్‌గా వర్షన్ అప్‌డేట్ అవుతుంది
      devOptions: {
        enabled: true, // లోకల్ సర్వర్‌లో (npm run dev) కూడా PWA యాక్టివేట్ చేయడానికి
      },
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      workbox: {
        // ఈ ఫైల్స్ అన్నింటినీ PWA ఆటోమేటిక్ గా కాష్ చేస్తుంది
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2,ttf}"],
        globIgnores: ["**/ticker.json"],
        cleanupOutdatedCaches: true,
        navigateFallbackDenylist: [/jataka_api/], // API మరియు Admin ఫైల్స్‌ను అడ్డుకోకుండా బైపాస్ చేయడానికి
      },
      manifest: {
        name: "e-JYOTISHA",
        short_name: "e-JYOTISHA",
        description: "A modern workspace for accurate horoscope generation.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: basePath,
        start_url: basePath,
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  };
});
