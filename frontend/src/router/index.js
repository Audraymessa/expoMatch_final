// ============================================
// CONFIGURATION DU ROUTER VUE
// ============================================
// Le router gère la navigation entre les différentes pages
// Chaque route correspond à une URL et un composant Vue

import { createRouter, createWebHistory } from 'vue-router'

// ============================================
// IMPORTATION DES VUES (Pages)
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
// DÉFINITION DES ROUTES
// ============================================
const routes = [
    // ----- ROUTES PUBLIQUES -----
    
    // Page d'accueil
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    
    // Détail d'un événement
    {
        path: '/evento/:id',
        name: 'EventDetail',
        component: EventDetailView
    },
    
    // Page de connexion
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    
    // Page d'inscription
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    },
    
    // ----- ROUTES PROTÉGÉES (ORGANIZZATORE) -----
    
    // Dashboard de l'organizzatore
    {
        path: '/dashboard/organizzatore',
        name: 'DashboardOrganizzatore',
        component: DashboardOrganizzatore,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // Créer un événement
    {
        path: '/evento/nuovo',
        name: 'CreateEvent',
        component: CreateEventView,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // Modifier un événement
    {
        path: '/evento/modifica/:id',
        name: 'EditEvent',
        component: EditEventView,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // Voir les candidatures d'un événement
    {
        path: '/evento/:id/candidature',
        name: 'CandidatureEvent',
        component: CandidatureEventView,
        meta: { requiresAuth: true, role: 'organizzatore' }
    },
    
    // ----- ROUTES PROTÉGÉES (VENDITORE) -----
    
    // Dashboard du venditore
    {
        path: '/dashboard/venditore',
        name: 'DashboardVenditore',
        component: DashboardVenditore,
        meta: { requiresAuth: true, role: 'venditore' }
    }
]

// ============================================
// CRÉATION DU ROUTER
// ============================================
const router = createRouter({
    // Mode "history" pour des URLs propres (sans #)
    history: createWebHistory(),
    routes
})

// ============================================
// GARDE DE NAVIGATION (Navigation Guard)
// ============================================
// Vérifie l'authentification avant chaque navigation

router.beforeEach((to, from, next) => {
    // Récupérer le token et les infos utilisateur du localStorage
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Si la route nécessite une authentification
    if (to.meta.requiresAuth) {
        // Vérifier si l'utilisateur est connecté
        if (!token) {
            // Rediriger vers login
            next({ name: 'Login', query: { redirect: to.fullPath } })
            return
        }
        
        // Vérifier si l'utilisateur a le bon rôle
        if (to.meta.role && user.ruolo !== to.meta.role) {
            // Rediriger vers le bon dashboard
            if (user.ruolo === 'organizzatore') {
                next({ name: 'DashboardOrganizzatore' })
            } else {
                next({ name: 'DashboardVenditore' })
            }
            return
        }
    }
    
    // Si déjà connecté et essaie d'accéder à login/register
    if ((to.name === 'Login' || to.name === 'Register') && token) {
        if (user.ruolo === 'organizzatore') {
            next({ name: 'DashboardOrganizzatore' })
        } else {
            next({ name: 'DashboardVenditore' })
        }
        return
    }
    
    // Continuer la navigation
    next()
})

export default router

