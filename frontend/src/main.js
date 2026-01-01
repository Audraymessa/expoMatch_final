// ============================================
// PUNTO DI INGRESSO DELL'APPLICAZIONE VUE.JS
// ============================================
// Questo file inizializza Vue e carica tutti i plugin

// Importazione di Vue
import { createApp } from 'vue'

// Importazione del componente radice
import App from './App.vue'

// Importazione del router (navigazione tra pagine)
import router from './router'

// Importazione di Bootstrap CSS e JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Importazione delle icone Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'

// Importazione degli stili personalizzati
import './assets/style.css'

// ============================================
// CREAZIONE DELL'APPLICAZIONE
// ============================================

const app = createApp(App)

// Aggiunta del router per la navigazione
app.use(router)

// Montaggio dell'applicazione sull'elemento #app
app.mount('#app')

