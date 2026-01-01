<!-- ============================================
     NAVBAR - Barre de Navigation
     ============================================
     Composant de navigation présent sur toutes les pages
     S'adapte selon l'état de connexion de l'utilisateur
-->

<template>
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <!-- Logo / Nom de l'application -->
            <RouterLink class="navbar-brand" to="/">
                <i class="bi bi-grid-3x3-gap-fill me-2" style="color: #4361ee;"></i>
                <span style="color: #4361ee; font-weight: bold;">Expo</span>Match
            </RouterLink>
            
            <!-- Bouton hamburger pour mobile -->
            <button 
                class="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <!-- Liens de navigation -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- Liens à gauche -->
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">Cerca Eventi</RouterLink>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#chi-siamo">Chi Siamo</a>
                    </li>
                </ul>
                
                <!-- Liens à droite (connexion/déconnexion) -->
                <ul class="navbar-nav">
                    <!-- Si NON connecté -->
                    <template v-if="!isAuthenticated">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/login">Accedi</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="btn btn-primary" to="/register">Registrati</RouterLink>
                        </li>
                    </template>
                    
                    <!-- Si connecté -->
                    <template v-else>
                        <li class="nav-item">
                            <span class="nav-link">Ciao, {{ user?.nome }}</span>
                        </li>
                        <li class="nav-item">
                            <RouterLink 
                                class="nav-link" 
                                :to="dashboardLink"
                            >
                                <i class="bi bi-grid-fill me-1"></i>Dashboard
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" @click.prevent="logout">
                                <i class="bi bi-box-arrow-right me-1"></i>Esci
                            </a>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { authService } from '../services/api'

export default {
    name: 'Navbar',
    
    data() {
        return {
            // État d'authentification
            isAuthenticated: false,
            user: null
        }
    },
    
    computed: {
        // Lien vers le bon dashboard selon le rôle
        dashboardLink() {
            if (this.user?.ruolo === 'organizzatore') {
                return '/dashboard/organizzatore'
            }
            return '/dashboard/venditore'
        }
    },
    
    methods: {
        // Déconnexion
        logout() {
            authService.logout()
            this.isAuthenticated = false
            this.user = null
            this.$router.push('/')
        },
        
        // Vérifier l'état de connexion
        checkAuth() {
            this.isAuthenticated = authService.isAuthenticated()
            this.user = authService.getCurrentUser()
        }
    },
    
    // Vérifier l'authentification au montage
    mounted() {
        this.checkAuth()
    },
    
    // Re-vérifier quand la route change
    watch: {
        '$route'() {
            this.checkAuth()
        }
    }
}
</script>

