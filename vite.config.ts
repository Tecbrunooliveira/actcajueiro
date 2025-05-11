import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Permite data:, cdnjs e fontes externas para PDF
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' data: blob: https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com *.supabase.co *.lovableproject.com wss://*.supabase.co; font-src 'self' data: https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; img-src 'self' data: https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;"
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "ACT - CAJUEIRO",
        short_name: "CAJUEIRO",
        description: "Aplicação PWA do ACT - CAJUEIRO",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon"
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      devOptions: {
        enabled: mode === "development",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
