
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD
import { VitePWA } from "vite-plugin-pwa";
=======
import { VitePWA } from 'vite-plugin-pwa';
>>>>>>> 886a4582aebdd58b135875b2c2c933f23b478d8b

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
<<<<<<< HEAD
      registerType: "autoUpdate",
=======
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000, // Increase size limit to 3MB to accommodate react-pdf
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Skip precaching these large files
        navigateFallbackDenylist: [/^.*\/react-pdf.*$/]
      },
>>>>>>> 886a4582aebdd58b135875b2c2c933f23b478d8b
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
<<<<<<< HEAD
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
=======
        ],
>>>>>>> 886a4582aebdd58b135875b2c2c933f23b478d8b
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
=======
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'react-pdf': ['@react-pdf/renderer'],
          ...Object.fromEntries(
            ['@tanstack/react-query', 'framer-motion', 'recharts', 'date-fns'].map(
              dep => [dep.split('/')[0] || dep, [dep]]
            )
          )
        },
        inlineDynamicImports: false,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@react-pdf/renderer'],
    esbuildOptions: {
      target: 'es2020',
      mainFields: ['module', 'main'],
    }
  }
>>>>>>> 886a4582aebdd58b135875b2c2c933f23b478d8b
}));
