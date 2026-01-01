// ============================================
// SERVICE API - Communication avec le Backend
// ============================================
// Ce fichier centralise tous les appels HTTP vers l'API
// Utilise Axios pour les requêtes AJAX

import axios from 'axios'

// ============================================
// CONFIGURATION D'AXIOS
// ============================================

// Créer une instance Axios avec la configuration de base
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // URL du backend
    headers: {
        'Content-Type': 'application/json'
    }
})

// ============================================
// INTERCEPTEUR DE REQUÊTE
// ============================================
// Ajoute automatiquement le token JWT à chaque requête

api.interceptors.request.use(
    (config) => {
        // Récupérer le token du localStorage
        const token = localStorage.getItem('token')
        
        // Si un token existe, l'ajouter aux headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// ============================================
// INTERCEPTEUR DE RÉPONSE
// ============================================
// Gère les erreurs globalement (ex: token expiré)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si erreur 401 (non autorisé), déconnecter l'utilisateur
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// ============================================
// SERVICES D'AUTHENTIFICATION
// ============================================

export const authService = {
    // Inscription d'un nouvel utilisateur
    async register(userData) {
        const response = await api.post('/auth/register', userData)
        return response.data
    },
    
    // Connexion
    async login(credentials) {
        const response = await api.post('/auth/login', credentials)
        // Stocker le token et les infos utilisateur
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },
    
    // Déconnexion
    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },
    
    // Récupérer le profil de l'utilisateur connecté
    async getProfile() {
        const response = await api.get('/auth/profile')
        return response.data
    },
    
    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return !!localStorage.getItem('token')
    },
    
    // Récupérer les infos de l'utilisateur connecté
    getCurrentUser() {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    }
}

// ============================================
// SERVICES DES ÉVÉNEMENTS
// ============================================

export const eventService = {
    // Récupérer tous les événements (avec filtres optionnels)
    async getAll(filters = {}) {
        const params = new URLSearchParams()
        if (filters.citta) params.append('citta', filters.citta)
        if (filters.data) params.append('data', filters.data)
        
        const response = await api.get(`/eventi?${params.toString()}`)
        return response.data
    },
    
    // Récupérer un événement par son ID
    async getById(id) {
        const response = await api.get(`/eventi/${id}`)
        return response.data
    },
    
    // Récupérer mes événements (organizzatore)
    async getMyEvents() {
        const response = await api.get('/eventi/miei/lista')
        return response.data
    },
    
    // Créer un nouvel événement
    async create(eventData) {
        const response = await api.post('/eventi', eventData)
        return response.data
    },
    
    // Modifier un événement
    async update(id, eventData) {
        const response = await api.put(`/eventi/${id}`, eventData)
        return response.data
    },
    
    // Supprimer un événement
    async delete(id) {
        const response = await api.delete(`/eventi/${id}`)
        return response.data
    }
}

// ============================================
// SERVICES DES CANDIDATURES
// ============================================

export const candidaturaService = {
    // Postuler à un événement (venditore)
    async create(candidaturaData) {
        const response = await api.post('/candidature', candidaturaData)
        return response.data
    },
    
    // Récupérer mes candidatures (venditore)
    async getMyCandidature() {
        const response = await api.get('/candidature/mie')
        return response.data
    },
    
    // Récupérer les candidatures d'un événement (organizzatore)
    async getEventCandidature(eventoId) {
        const response = await api.get(`/candidature/evento/${eventoId}`)
        return response.data
    },
    
    // Approuver/Refuser une candidature (organizzatore)
    async updateStatus(id, stato) {
        const response = await api.put(`/candidature/${id}`, { stato })
        return response.data
    },
    
    // Retirer ma candidature (venditore)
    async delete(id) {
        const response = await api.delete(`/candidature/${id}`)
        return response.data
    }
}

export default api

