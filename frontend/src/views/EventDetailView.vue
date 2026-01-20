<template>
    <div class="container py-4">
        <RouterLink to="/" class="text-primary text-decoration-none mb-4 d-inline-block">
            <i class="bi bi-arrow-left me-2"></i>Torna agli eventi
        </RouterLink>
        
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>
        
        <div v-else-if="event">
            <img 
                :src="event.immagine || defaultImage" 
                :alt="event.titolo"
                class="event-detail-img mb-4 w-100"
                style="max-height: 400px; object-fit: cover; border-radius: 8px;"
                @error="handleImageError"
            >
            
            <div class="bg-white p-4 rounded border mb-4">
                <h1 class="h3 mb-4">{{ event.titolo }}</h1>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="detail-info mb-3">
                            <i class="bi bi-calendar me-2"></i>
                            <span class="text-muted small d-block">Data</span>
                            <strong>{{ formatDate(event.data_evento) }}</strong>
                        </div>
                        
                        <div class="detail-info mb-3">
                            <i class="bi bi-people me-2"></i>
                            <span class="text-muted small d-block">Disponibilità</span>
                            <strong>{{ event.posti_disponibili }}/{{ event.posti_totali }}</strong>
                        </div>
                        
                        <div class="detail-info mb-3">
                            <i class="bi bi-geo-alt me-2"></i>
                            <span class="text-muted small d-block">Luogo</span>
                            <strong>{{ event.citta }}</strong>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="detail-info mb-3">
                            <i class="bi bi-aspect-ratio me-2"></i>
                            <span class="text-muted small d-block">Dimensione Stand</span>
                            <strong>{{ event.dimensione_stand || 'N/D' }}</strong>
                        </div>
                        
                        <div class="detail-info mb-3">
                            <i class="bi bi-currency-euro me-2"></i>
                            <span class="text-muted small d-block">Prezzo</span>
                            <strong class="fs-5">{{ event.prezzo }} €</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-4 rounded border mb-4">
                <h5 class="mb-3">Descrizione</h5>
                <p>{{ event.descrizione }}</p>
            </div>
            
            <div class="bg-white p-4 rounded border mb-4" v-if="event.requisiti && event.requisiti.length">
                <h5 class="mb-3">Requisiti Tecnici</h5>
                <ul class="list-unstyled">
                    <li v-for="(req, index) in event.requisiti" :key="index" class="mb-2">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        {{ req }}
                    </li>
                </ul>
            </div>
            
            <div class="bg-white p-4 rounded border">
                <h5 class="mb-3">Candidati per questo evento</h5>
                
                <div v-if="!isAuthenticated">
                    <p class="text-muted mb-3">
                        Devi effettuare l'accesso per candidarti a questo evento
                    </p>
                    <RouterLink to="/login" class="btn btn-primary w-100">
                        Accedi per candidare
                    </RouterLink>
                </div>
                
                <div v-else-if="user?.ruolo === 'organizzatore'">
                    <p class="text-muted">
                        Solo i venditori possono candidarsi agli eventi.
                    </p>
                </div>
                
                <div v-else>
                    
                    <div v-if="checkingApplication" class="text-center py-4">
                        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                        <span class="ms-2 text-muted">Verifica stato candidatura...</span>
                    </div>

                    <div v-else-if="hasApplied" class="text-center p-4 bg-light rounded border">
                        <div class="mb-3">
                            <i class="bi bi-check-circle-fill text-success" style="font-size: 2.5rem;"></i>
                        </div>
                        <h5 class="fw-bold mb-2">Candidatura inviata</h5>
                        <p class="text-muted mb-3">Hai già inviato una richiesta per questo evento.</p>
                        
                        <div class="d-inline-block">
                            <span class="text-muted me-2">Stato attuale:</span>
                            <span class="badge rounded-pill" 
                                :class="{
                                    'bg-warning text-dark': applicationStatus === 'in_attesa',
                                    'bg-success': applicationStatus === 'approvata',
                                    'bg-danger': applicationStatus === 'rifiutata'
                                }"
                                style="font-size: 0.9rem; padding: 0.5em 1em;">
                                {{ applicationStatus ? applicationStatus.replace('_', ' ').toUpperCase() : 'N/D' }}
                            </span>
                        </div>
                    </div>

                    <div v-else>
                        <div v-if="candidaturaError" class="alert alert-danger">
                            {{ candidaturaError }}
                        </div>
                        
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
                            class="btn btn-primary w-100 py-2"
                            @click="submitCandidatura"
                            :disabled="candidaturaLoading || event.posti_disponibili === 0">
                            <span v-if="candidaturaLoading" class="spinner-border spinner-border-sm me-2"></span>
                            {{ event.posti_disponibili === 0 ? 'Posti esauriti' : 'Invia Candidatura' }}
                        </button>
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
                isAuthenticated: false,
                user: null,
                candidaturaMessage: '',
                candidaturaLoading: false,
                candidaturaSuccess: null,
                candidaturaError: null,
                checkingApplication: false, 
                hasApplied: false,
                applicationStatus: null 
            }
        },
        
        methods: {
            async loadEvent() {
                try {
                    this.loading = true;
                    const id = this.$route.params.id;
                    this.event = await eventService.getById(id);
                    
                    // --- LOG DI CONTROLLO 1 ---
                    console.log("1. Evento caricato:", id);
                    console.log("2. Utente:", this.user);
                    console.log("3. Ruolo:", this.user?.ruolo);
                    
                    if (this.isAuthenticated && this.user.ruolo === 'venditore') {
                        console.log("4. Sono un venditore, avvio il controllo...");
                        this.checkExistingCandidatura(id);
                    } else {
                        console.log("4. NON avvio il controllo (non loggato o non venditore)");
                    }
    
                } catch (err) {
                    console.error('Errore loadEvent:', err);
                    this.error = 'Impossibile caricare l\'evento.';
                } finally {
                    this.loading = false;
                }
            },
    
            async checkExistingCandidatura(eventId) {
                try {
                    this.checkingApplication = true;
                    console.log("5. Chiedo al server: /api/candidature/check/" + eventId);
                    
                    const response = await candidaturaService.check(eventId);
                    
                    // --- LOG DI CONTROLLO 2 ---
                    console.log("6. Risposta del server:", response);
                    
                    if (response.candidato === true) {
                        console.log("7. RISULTATO: Già candidato! Cambio il bottone.");
                        this.hasApplied = true;
                        this.applicationStatus = response.stato;
                    } else {
                        console.log("7. RISULTATO: Non ancora candidato.");
                        this.hasApplied = false;
                    }
                } catch (err) {
                    console.error("ERRORE nel controllo:", err);
                } finally {
                    this.checkingApplication = false;
                }
            },
            
            async submitCandidatura() {
                try {
                    this.candidaturaLoading = true;
                    await candidaturaService.create({
                        evento_id: this.event.id,
                        messaggio: this.candidaturaMessage
                    });
                    
                    console.log("8. Candidatura inviata con successo, aggiorno la UI.");
                    this.hasApplied = true;
                    this.applicationStatus = 'in_attesa';
    
                } catch (err) {
                    console.error('Errore candidatura:', err);
                    this.candidaturaError = err.response?.data?.error || 'Errore.';
                } finally {
                    this.candidaturaLoading = false;
                }
            },
            
            formatDate(dateString) { /* ... resto uguale ... */ },
            handleImageError(e) { e.target.src = this.defaultImage }
        },
        
        mounted() {
            this.isAuthenticated = authService.isAuthenticated();
            this.user = authService.getCurrentUser();
            this.loadEvent();
        }
    }
    </script>