import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'; // ✅ REQUIRED for Tailwind v4

export default defineConfig({
  plugins: [
    tailwindcss(), // ✅ Enables Tailwind CSS processing
    react()
  ],

  base: '/', // ensures assets load from root

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        ws: true
      }
    }
  },

  define: {
    'process.env': {
      VITE_BACKEND_URL: process.env.VITE_BACKEND_URL || 'http://localhost:5000'
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});