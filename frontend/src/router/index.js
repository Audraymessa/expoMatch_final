// ============================================
// CONFIGURAZIONE DEL ROUTER VUE
// ============================================
// Il router gestisce la navigazione tra le diverse pagine
// Ogni route corrisponde a un URL e un componente Vue

import { createRouter, createWebHistory } from 'vue-router'

// ============================================
// IMPORTAZIONE DELLE VISTE (Pagine)
// ============================================
import HomeView from '../views/HomeView.vue'
import EventDetailView from '../views/EventDetailView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardOrganizzatore from '../views/DashboardOrganizzatore.vue'
import DashboardVenditore from '../views/DashboardVenditore.vue'
import CreateEventView from '../views/CreateEventView.vue'
import EditEventView from '../views/EditEventView.vue'
import CandidatureEventView from '../views/CandidatureEventView.vue'

// ============================================
// DEFINIZIONE DELLE ROUTE
// ============================================
const routes = [
    // ----- ROUTE PUBBLICHE -----
    
    // Pagina principale
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    
    // Dettaglio di un evento
    {
        path: '/evento/:id',
        name: 'EventDetail',
        component: EventDetailView
    },
    
    // Pagina di accesso
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    
    // Pagina di registrazione
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    
    // ----- ROUTE PROTETTE (ORGANIZZATORE) -----
    
    // Dashboard dell'organizzatore
    {
        path: '/dashboard/organizzatore',
        name: 'DashboardOrganizzatore',
        component: DashboardOrganizzatore,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // Creare un evento
    {
        path: '/evento/nuovo',
        name: 'CreateEvent',
        component: CreateEventView,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // Modificare un evento
    {
        path: '/evento/modifica/:id',
        name: 'EditEvent',
        component: EditEventView,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // Vedere le candidature di un evento
    {
        path: '/evento/:id/candidature',
        name: 'CandidatureEvent',
        component: CandidatureEventView,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // ----- ROUTE PROTETTE (VENDITORE) -----
    
    // Dashboard del venditore
    {
        path: '/dashboard/venditore',
        name: 'DashboardVenditore',
        component: DashboardVenditore,
        meta: { requiresAuth: true, role: 'venditore' }
    }
]

// ============================================
// CREAZIONE DEL ROUTER
// ============================================
const router = createRouter({
    // Modalità "history" per URL puliti (senza #)
    history: createWebHistory(),
    routes
})

// ============================================
// GUARDIA DI NAVIGAZIONE (Navigation Guard)
// ============================================
// Verifica l'autenticazione prima di ogni navigazione

router.beforeEach((to, from, next) => {
    // Recuperare il token e le informazioni utente dal localStorage
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Se la route richiede autenticazione
    if (to.meta.requiresAuth) {
        // Verificare se l'utente è connesso
        if (!token) {
            // Reindirizzare al login
            next({ name: 'Login', query: { redirect: to.fullPath } })
            return
        }
        
        // Verificare se l'utente ha il ruolo corretto
        if (to.meta.role && user.ruolo !== to.meta.role) {
            // Reindirizzare al dashboard corretto
            if (user.ruolo === 'organizzatore') {
                next({ name: 'DashboardOrganizzatore' })
            } else {
                next({ name: 'DashboardVenditore' })
            }
            return
        }
    }
    
    // Se già connesso e tenta di accedere a login/register
    if ((to.name === 'Login' || to.name === 'Register') && token) {
        if (user.ruolo === 'organizzatore') {
            next({ name: 'DashboardOrganizzatore' })
        } else {
            next({ name: 'DashboardVenditore' })
        }
        return
    }
    
    // Continuare la navigazione
    next()
})

export default router

