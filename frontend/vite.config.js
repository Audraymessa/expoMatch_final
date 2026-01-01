// ============================================
// CONFIGURAZIONE VITE
// ============================================
// Vite è il bundler utilizzato per Vue.js 3
// Offre un ricaricamento a caldo ultra-rapido

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Plugin Vue.js per compilare i file .vue
  plugins: [vue()],
  
  // Configurazione del server di sviluppo
  server: {
    port: 5173,  // Porta del frontend
    proxy: {
      // Proxy per le chiamate API al backend
      // Le richieste /api/* saranno reindirizzate a localhost:3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})

