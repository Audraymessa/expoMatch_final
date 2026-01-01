// ============================================
// CONFIGURATION VITE
// ============================================
// Vite est le bundler utilisé pour Vue.js 3
// Il offre un rechargement à chaud ultra-rapide

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Plugin Vue.js pour compiler les fichiers .vue
  plugins: [vue()],
  
  // Configuration du serveur de développement
  server: {
    port: 5173,  // Port du frontend
    proxy: {
      // Proxy pour les appels API vers le backend
      // Les requêtes /api/* seront redirigées vers localhost:3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})

