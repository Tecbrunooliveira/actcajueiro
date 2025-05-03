
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "8e52839b-ceef-418b-82da-d044b20dd4f1.lovableproject.com"
    ],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ACT - CAJUEIRO',
        short_name: 'CAJUEIRO',
        description: 'Aplicação PWA do ACT - CAJUEIRO',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
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
}));
