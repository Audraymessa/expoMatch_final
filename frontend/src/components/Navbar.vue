<!-- ============================================
     NAVBAR - Barra di Navigazione
     ============================================
     Componente di navigazione presente su tutte le pagine
     Si adatta in base allo stato di connessione dell'utente
-->

<template>
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <!-- Logo / Nome dell'applicazione -->
            <RouterLink class="navbar-brand d-flex align-items-center" to="/">
                <img src="../assets/logo.png" alt="ExpoMatch Logo" style="height: 40px; margin-right: 10px;">
                <span style="color: #4361ee; font-weight: bold;">ExpoMatch</span>
            </RouterLink>
            
            <!-- Pulsante hamburger per mobile -->
            <button 
                class="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <!-- Link di navigazione -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <!-- Link a sinistra -->
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/">Cerca Eventi</RouterLink>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#chi-siamo">Chi Siamo</a>
                    </li>
                </ul>
                
                <!-- Link a destra (accesso/disconnessione) -->
                <ul class="navbar-nav">
                    <!-- Se NON connesso -->
                    <template v-if="!isAuthenticated">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/login">Accedi</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="btn btn-primary" to="/register">Registrati</RouterLink>
                        </li>
                    </template>
                    
                    <!-- Se connesso -->
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
                            <RouterLink 
                                class="nav-link" 
                                to="/calendario"
                            >
                                <i class="bi bi-calendar3 me-1"></i>Calendario
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
            // Stato di autenticazione
            isAuthenticated: false,
            user: null
        }
    },
    
    computed: {
        // Link al dashboard corretto in base al ruolo
        dashboardLink() {
            if (this.user?.ruolo === 'organizzatore') {
                return '/dashboard/organizzatore'
            }
            return '/dashboard/venditore'
        }
    },
    
    methods: {
        // Disconnessione
        logout() {
            authService.logout()
            this.isAuthenticated = false
            this.user = null
            this.$router.push('/')
        },
        
        // Verificare lo stato di connessione
        checkAuth() {
            this.isAuthenticated = authService.isAuthenticated()
            this.user = authService.getCurrentUser()
        }
    },
    
    // Verificare l'autenticazione al montaggio
    mounted() {
        this.checkAuth()
    },
    
    // Ri-verificare quando la route cambia
    watch: {
        '$route'() {
            this.checkAuth()
        }
    }
}
</script>

