
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// import { componentTagger } from "lovable-tagger";
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
    // mode === 'development' &&
    // componentTagger(),
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
          // Adicione outros ícones se desejar
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
        manualChunks(id) {
          // Garantir que React seja carregado primeiro
          if (id.includes('node_modules/react')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Depois carregar react-pdf
          if (id.includes('node_modules/react-pdf') || id.includes('node_modules/@react-pdf')) {
            return 'react-pdf';
          }
          // Outros módulos
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Garantir que o React seja pré-bundled
    esbuildOptions: {
      mainFields: ['module', 'main'], // Ajudar na resolução de módulos
    }
  }
}));
