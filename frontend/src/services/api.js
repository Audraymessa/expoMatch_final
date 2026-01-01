// ============================================
// SERVIZIO API - Comunicazione con il Backend
// ============================================
// Questo file centralizza tutte le chiamate HTTP all'API
// Utilizza Axios per le richieste AJAX

import axios from 'axios'

// ============================================
// CONFIGURAZIONE DI AXIOS
// ============================================

// Creare un'istanza Axios con la configurazione di base
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // URL del backend
    headers: {
        'Content-Type': 'application/json'
    }
})

// ============================================
// INTERCETTORE DI RICHIESTA
// ============================================
// Aggiunge automaticamente il token JWT a ogni richiesta

api.interceptors.request.use(
    (config) => {
        // Recuperare il token dal localStorage
        const token = localStorage.getItem('token')
        
        // Se esiste un token, aggiungerlo agli header
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
// INTERCETTORE DI RISPOSTA
// ============================================
// Gestisce gli errori globalmente (es: token scaduto)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se errore 401 (non autorizzato), disconnettere l'utente
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// ============================================
// SERVIZI DI AUTENTICAZIONE
// ============================================

export const authService = {
    // Registrazione di un nuovo utente
    async register(userData) {
        const response = await api.post('/auth/register', userData)
        return response.data
    },
    
    // Accesso
    async login(credentials) {
        const response = await api.post('/auth/login', credentials)
        // Memorizzare il token e le informazioni utente
        if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },
    
    // Disconnessione
    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },
    
    // Recuperare il profilo dell'utente connesso
    async getProfile() {
        const response = await api.get('/auth/profile')
        return response.data
    },
    
    // Verificare se l'utente è connesso
    isAuthenticated() {
        return !!localStorage.getItem('token')
    },
    
    // Recuperare le informazioni dell'utente connesso
    getCurrentUser() {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    }
}

// ============================================
// SERVIZI DEGLI EVENTI
// ============================================

export const eventService = {
    // Recuperare tutti gli eventi (con filtri opzionali)
    async getAll(filters = {}) {
        const params = new URLSearchParams()
        if (filters.citta) params.append('citta', filters.citta)
        if (filters.data) params.append('data', filters.data)
        
        const response = await api.get(`/eventi?${params.toString()}`)
        return response.data
    },
    
    // Recuperare un evento tramite il suo ID
    async getById(id) {
        const response = await api.get(`/eventi/${id}`)
        return response.data
    },
    
    // Recuperare i miei eventi (organizzatore)
    async getMyEvents() {
        const response = await api.get('/eventi/miei/lista')
        return response.data
    },
    
    // Creare un nuovo evento
    async create(eventData) {
        const response = await api.post('/eventi', eventData)
        return response.data
    },
    
    // Modificare un evento
    async update(id, eventData) {
        const response = await api.put(`/eventi/${id}`, eventData)
        return response.data
    },
    
    // Eliminare un evento
    async delete(id) {
        const response = await api.delete(`/eventi/${id}`)
        return response.data
    }
}

// ============================================
// SERVIZI DELLE CANDIDATURE
// ============================================

export const candidaturaService = {
    // Candidarsi a un evento (venditore)
    async create(candidaturaData) {
        const response = await api.post('/candidature', candidaturaData)
        return response.data
    },
    
    // Recuperare le mie candidature (venditore)
    async getMyCandidature() {
        const response = await api.get('/candidature/mie')
        return response.data
    },
    
    // Recuperare le candidature di un evento (organizzatore)
    async getEventCandidature(eventoId) {
        const response = await api.get(`/candidature/evento/${eventoId}`)
        return response.data
    },
    
    // Approvare/Rifiutare una candidatura (organizzatore)
    async updateStatus(id, stato) {
        const response = await api.put(`/candidature/${id}`, { stato })
        return response.data
    },
    
    // Ritirare la mia candidatura (venditore)
    async delete(id) {
        const response = await api.delete(`/candidature/${id}`)
        return response.data
    }
}

export default api

