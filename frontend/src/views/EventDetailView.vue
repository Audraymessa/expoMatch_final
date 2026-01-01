<!-- ============================================
     EVENT DETAIL VIEW - Détail d'un Événement
     ============================================
     Affiche toutes les informations d'un événement
     Permet aux venditori de postuler
-->

<template>
    <div class="container py-4">
        <!-- Lien retour -->
        <RouterLink to="/" class="text-primary text-decoration-none mb-4 d-inline-block">
            <i class="bi bi-arrow-left me-2"></i>Torna agli eventi
        </RouterLink>
        
        <!-- Chargement -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
        
        <!-- Erreur -->
        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>
        
        <!-- Contenu -->
        <div v-else-if="event" class="row">
            <!-- Colonne gauche: Image et infos -->
            <div class="col-lg-8">
                <!-- Image -->
                <img 
                    :src="event.immagine || defaultImage" 
                    :alt="event.titolo"
                    class="event-detail-img mb-4"
                    @error="handleImageError"
                >
                
                <!-- Titre et infos principales -->
                <div class="bg-white p-4 rounded border mb-4">
                    <h1 class="h3 mb-4">{{ event.titolo }}</h1>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-info">
                                <i class="bi bi-calendar"></i>
                                <div>
                                    <small class="text-muted">Data</small>
                                    <div>{{ formatDate(event.data_evento) }}</div>
                                </div>
                            </div>
                            
                            <div class="detail-info">
                                <i class="bi bi-people"></i>
                                <div>
                                    <small class="text-muted">Disponibilità</small>
                                    <div>{{ event.posti_disponibili }}/{{ event.posti_totali }}</div>
                                </div>
                            </div>
                            
                            <div class="detail-info">
                                <i class="bi bi-geo-alt"></i>
                                <div>
                                    <small class="text-muted">Luogo</small>
                                    <div>{{ event.citta }}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="detail-info">
                                <i class="bi bi-aspect-ratio"></i>
                                <div>
                                    <small class="text-muted">Dimensione Stand</small>
                                    <div>{{ event.dimensione_stand || 'N/D' }}</div>
                                </div>
                            </div>
                            
                            <div class="detail-info">
                                <i class="bi bi-currency-euro"></i>
                                <div>
                                    <small class="text-muted">Prezzo</small>
                                    <div class="fw-bold">{{ event.prezzo }} €</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Description -->
                <div class="bg-white p-4 rounded border mb-4">
                    <h5 class="mb-3">Descrizione</h5>
                    <p>{{ event.descrizione }}</p>
                </div>
                
                <!-- Requisiti Tecnici -->
                <div class="bg-white p-4 rounded border" v-if="event.requisiti && event.requisiti.length">
                    <h5 class="mb-3">Requisiti Tecnici</h5>
                    <ul class="list-unstyled">
                        <li v-for="(req, index) in event.requisiti" :key="index" class="mb-2">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            {{ req }}
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Colonne droite: Box candidature -->
            <div class="col-lg-4">
                <div class="candidatura-box sticky-top" style="top: 100px;">
                    <h5 class="mb-3">Candidati per questo evento</h5>
                    
                    <!-- Si non connecté -->
                    <div v-if="!isAuthenticated">
                        <p class="text-muted">
                            Devi effettuare l'accesso per candidarti a questo evento
                        </p>
                        <RouterLink to="/login" class="btn btn-primary w-100">
                            Accedi per candidare
                        </RouterLink>
                    </div>
                    
                    <!-- Si connecté comme organizzatore -->
                    <div v-else-if="user?.ruolo === 'organizzatore'">
                        <p class="text-muted">
                            Solo i venditori possono candidarsi agli eventi.
                        </p>
                    </div>
                    
                    <!-- Si connecté comme venditore -->
                    <div v-else>
                        <!-- Message succès/erreur -->
                        <div v-if="candidaturaSuccess" class="alert alert-success">
                            {{ candidaturaSuccess }}
                        </div>
                        <div v-if="candidaturaError" class="alert alert-danger">
                            {{ candidaturaError }}
                        </div>
                        
                        <!-- Formulaire de candidature -->
                        <div v-if="!candidaturaSuccess">
                            <div class="mb-3">
                                <label class="form-label">Messaggio (opzionale)</label>
                                <textarea 
                                    class="form-control" 
                                    v-model="candidaturaMessage"
                                    rows="3"
                                    placeholder="Presenta la tua attività..."
                                ></textarea>
                            </div>
                            
                            <button 
                                class="btn btn-primary w-100"
                                @click="submitCandidatura"
                                :disabled="candidaturaLoading || event.posti_disponibili === 0"
                            >
                                <span v-if="candidaturaLoading" class="spinner-border spinner-border-sm me-2"></span>
                                {{ event.posti_disponibili === 0 ? 'Posti esauriti' : 'Invia Candidatura' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventService, candidaturaService, authService } from '../services/api'

export default {
    name: 'EventDetailView',
    
    data() {
        return {
            event: null,
            loading: true,
            error: null,
            defaultImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
            
            // Authentification
            isAuthenticated: false,
            user: null,
            
            // Candidature
            candidaturaMessage: '',
            candidaturaLoading: false,
            candidaturaSuccess: null,
            candidaturaError: null
        }
    },
    
    methods: {
        // Charger l'événement
        async loadEvent() {
            try {
                this.loading = true
                this.error = null
                const id = this.$route.params.id
                this.event = await eventService.getById(id)
            } catch (err) {
                console.error('Erreur chargement événement:', err)
                this.error = 'Impossibile caricare l\'evento.'
            } finally {
                this.loading = false
            }
        },
        
        // Soumettre une candidature
        async submitCandidatura() {
            try {
                this.candidaturaLoading = true
                this.candidaturaError = null
                
                await candidaturaService.create({
                    evento_id: this.event.id,
                    messaggio: this.candidaturaMessage
                })
                
                this.candidaturaSuccess = 'Candidatura inviata con successo! Attendi la risposta dell\'organizzatore.'
                
            } catch (err) {
                console.error('Erreur candidature:', err)
                this.candidaturaError = err.response?.data?.error || 'Errore nell\'invio della candidatura.'
            } finally {
                this.candidaturaLoading = false
            }
        },
        
        // Formater la date
        formatDate(dateString) {
            if (!dateString) return 'N/D'
            const date = new Date(dateString)
            return date.toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        },
        
        // Gérer erreur image
        handleImageError(e) {
            e.target.src = this.defaultImage
        }
    },
    
    mounted() {
        this.loadEvent()
        this.isAuthenticated = authService.isAuthenticated()
        this.user = authService.getCurrentUser()
    }
}
</script>

