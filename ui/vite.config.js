import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  /** Développement : on relaie l'API vers Express (localhost:3000) */
  server: {
    proxy: {
      // Proxy des appels API vers le serveur backend
      '/agents': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      // Proxy pour tous les appels aux agents
      '^/[^/]+/(invoke|stream)': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    },
  },
})
