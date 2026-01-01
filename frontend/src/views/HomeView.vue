<!-- ============================================
     HOME VIEW - Pagina Principale
     ============================================
     Pagina principale dell'applicazione con:
     - Sezione Hero (banner con ricerca)
     - Elenco degli eventi disponibili
     - Sezione "Chi Siamo"
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
                
                <!-- Barra di ricerca -->
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
                
                <!-- Statistiche -->
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
        
        <!-- ========== ELENCO DEGLI EVENTI ========== -->
        <section class="py-5">
            <div class="container">
                <h2 class="mb-2">Eventi Disponibili</h2>
                <p class="text-muted mb-4">{{ events.length }} eventi trovati</p>
                
                <!-- Messaggio di caricamento -->
                <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Caricamento...</span>
                    </div>
                </div>
                
                <!-- Messaggio di errore -->
                <div v-else-if="error" class="alert alert-danger">
                    {{ error }}
                </div>
                
                <!-- Griglia degli eventi -->
                <div v-else class="row g-4">
                    <div 
                        v-for="event in events" 
                        :key="event.id" 
                        class="col-md-6 col-lg-4"
                    >
                        <EventCard :event="event" />
                    </div>
                    
                    <!-- Messaggio se nessun evento -->
                    <div v-if="events.length === 0" class="col-12 text-center py-5">
                        <i class="bi bi-calendar-x display-4 text-muted"></i>
                        <p class="text-muted mt-3">Nessun evento trovato</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- ========== SEZIONE CHI SIAMO ========== -->
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
            events: [],           // Elenco degli eventi
            loading: true,        // Stato di caricamento
            error: null,          // Messaggio di errore
            searchQuery: ''       // Ricerca
        }
    },
    
    methods: {
        // Caricare gli eventi dall'API
        async loadEvents() {
            try {
                this.loading = true
                this.error = null
                this.events = await eventService.getAll()
            } catch (err) {
                console.error('Errore caricamento eventi:', err)
                this.error = 'Impossibile caricare gli eventi. Riprova più tardi.'
            } finally {
                this.loading = false
            }
        },
        
        // Cercare eventi
        async searchEvents() {
            try {
                this.loading = true
                this.error = null
                // Ricerca per città
                this.events = await eventService.getAll({ citta: this.searchQuery })
            } catch (err) {
                console.error('Errore ricerca:', err)
                this.error = 'Errore nella ricerca.'
            } finally {
                this.loading = false
            }
        }
    },
    
    // Caricare gli eventi al montaggio del componente
    mounted() {
        this.loadEvents()
    }
}
</script>

