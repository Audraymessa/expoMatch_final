<!-- ============================================
     HOME VIEW - Page d'Accueil
     ============================================
     Page principale de l'application avec:
     - Hero section (bannière avec recherche)
     - Liste des événements disponibles
     - Section "Chi Siamo"
-->

<template>
    <div class="home">
        <!-- ========== HERO SECTION ========== -->
        <section class="hero-section">
            <div class="container">
                <h1>Trova il posto perfetto per esporre i tuoi prodotti</h1>
                <p>
                    Connetti con organizzatori di eventi in tutta Italia. Scopri 
                    mercatini, fiere, festival e trova lo spazio ideale per il tuo business.
                </p>
                
                <!-- Barre de recherche -->
                <div class="search-container">
                    <div class="input-group">
                        <input 
                            type="text" 
                            class="form-control" 
                            placeholder="Cerca per città o date..."
                            v-model="searchQuery"
                            @keyup.enter="searchEvents"
                        >
                        <button class="btn btn-light" @click="searchEvents">
                            Cerca
                        </button>
                    </div>
                </div>
                
                <!-- Statistiques -->
                <div class="stats-container">
                    <div class="stat-item">
                        <div class="stat-number">150+</div>
                        <div class="stat-label">Eventi Attivi</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">50+</div>
                        <div class="stat-label">Città</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">2000+</div>
                        <div class="stat-label">Venditori</div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- ========== LISTE DES ÉVÉNEMENTS ========== -->
        <section class="py-5">
            <div class="container">
                <h2 class="mb-2">Eventi Disponibili</h2>
                <p class="text-muted mb-4">{{ events.length }} eventi trovati</p>
                
                <!-- Message de chargement -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Caricamento...</span>
                    </div>
                </div>
                
                <!-- Message d'erreur -->
                <div v-else-if="error" class="alert alert-danger">
                    {{ error }}
                </div>
                
                <!-- Grille des événements -->
                <div v-else class="row g-4">
                    <div 
                        v-for="event in events" 
                        :key="event.id" 
                        class="col-md-6 col-lg-4"
                    >
                        <EventCard :event="event" />
                    </div>
                    
                    <!-- Message si aucun événement -->
                    <div v-if="events.length === 0" class="col-12 text-center py-5">
                        <i class="bi bi-calendar-x display-4 text-muted"></i>
                        <p class="text-muted mt-3">Nessun evento trovato</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- ========== SECTION CHI SIAMO ========== -->
        <section id="chi-siamo" class="about-section bg-white">
            <div class="container">
                <h2 class="mb-4">Chi Siamo</h2>
                <p class="lead mb-5" style="max-width: 700px; margin: 0 auto;">
                    ExpoMatch è la piattaforma che connette venditori e organizzatori 
                    di eventi in tutta Italia. Semplifichiamo il processo di ricerca 
                    e prenotazione di spazi espositivi, rendendo facile per i venditori 
                    trovare le opportunità giuste e per gli organizzatori riempire i loro eventi.
                </p>
                
                <!-- Features -->
                <div class="row">
                    <div class="col-md-4">
                        <div class="feature-card">
                            <i class="bi bi-shop display-4 text-primary"></i>
                            <h5>Per Venditore</h5>
                            <p class="text-muted">
                                Trova eventi perfetti per i tuoi prodotti e candidati facilmente
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature-card">
                            <i class="bi bi-calendar-check display-4 text-primary"></i>
                            <h5>Per Organizzatore</h5>
                            <p class="text-muted">
                                Gestisci i tuoi eventi e richieste in un'unica dashboard
                            </p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature-card">
                            <i class="bi bi-shield-check display-4 text-primary"></i>
                            <h5>Sicuro e Affidabile</h5>
                            <p class="text-muted">
                                Piattaforma sicura con sistemi di verifica e pagamenti protetti
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import EventCard from '../components/EventCard.vue'
import { eventService } from '../services/api'

export default {
    name: 'HomeView',
    
    components: {
        EventCard
    },
    
    data() {
        return {
            events: [],           // Liste des événements
            loading: true,        // État de chargement
            error: null,          // Message d'erreur
            searchQuery: ''       // Recherche
        }
    },
    
    methods: {
        // Charger les événements depuis l'API
        async loadEvents() {
            try {
                this.loading = true
                this.error = null
                this.events = await eventService.getAll()
            } catch (err) {
                console.error('Erreur chargement événements:', err)
                this.error = 'Impossibile caricare gli eventi. Riprova più tardi.'
            } finally {
                this.loading = false
            }
        },
        
        // Rechercher des événements
        async searchEvents() {
            try {
                this.loading = true
                this.error = null
                // Recherche par ville
                this.events = await eventService.getAll({ citta: this.searchQuery })
            } catch (err) {
                console.error('Erreur recherche:', err)
                this.error = 'Errore nella ricerca.'
            } finally {
                this.loading = false
            }
        }
    },
    
    // Charger les événements au montage du composant
    mounted() {
        this.loadEvents()
    }
}
</script>

