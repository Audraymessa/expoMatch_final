// ============================================
// POINT D'ENTRÉE DE L'APPLICATION VUE.JS
// ============================================
// Ce fichier initialise Vue et charge tous les plugins

// Importation de Vue
import { createApp } from 'vue'

// Importation du composant racine
import App from './App.vue'

// Importation du router (navigation entre pages)
import router from './router'

// Importation de Bootstrap CSS et JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Importation des icônes Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'

// Importation des styles personnalisés
import './assets/style.css'

// ============================================
// CRÉATION DE L'APPLICATION
// ============================================

const app = createApp(App)

// Ajout du router pour la navigation
app.use(router)

// Montage de l'application sur l'élément #app
app.mount('#app')

