<!-- ============================================
     EDIT EVENT VIEW - Modifier un Événement
     ============================================
     Formulaire pour modifier un événement existant
     Réservé aux organizzatori (propriétaire)
-->

<template>
    <div class="container py-4">
        <!-- Lien retour -->
        <RouterLink to="/dashboard/organizzatore" class="text-primary text-decoration-none mb-4 d-inline-block">
            <i class="bi bi-arrow-left me-2"></i>Torna al Dashboard
        </RouterLink>
        
        <!-- Chargement -->
        <div v-if="loadingEvent" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
        
        <div v-else class="row justify-content-center">
            <div class="col-lg-8">
                <div class="form-container">
                    <h2 class="mb-4">Modifica Evento</h2>
                    
                    <!-- Message d'erreur -->
                    <div v-if="error" class="alert alert-danger">
                        {{ error }}
                    </div>
                    
                    <!-- Formulaire -->
                    <form @submit.prevent="handleSubmit">
                        <!-- Titre -->
                        <div class="mb-3">
                            <label class="form-label">Titolo Evento *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="form.titolo"
                                required
                            >
                        </div>
                        
                        <!-- Description -->
                        <div class="mb-3">
                            <label class="form-label">Descrizione *</label>
                            <textarea 
                                class="form-control" 
                                v-model="form.descrizione"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        
                        <!-- Adresse et Ville -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Indirizzo completo</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.indirizzo"
                                >
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Città *</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.citta"
                                    required
                                >
                            </div>
                        </div>
                        
                        <!-- Date et Prix -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Data Evento *</label>
                                <input 
                                    type="date" 
                                    class="form-control" 
                                    v-model="form.data_evento"
                                    required
                                >
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Prezzo (€) *</label>
                                <input 
                                    type="number" 
                                    class="form-control" 
                                    v-model="form.prezzo"
                                    min="0"
                                    required
                                >
                            </div>
                        </div>
                        
                        <!-- Nombre de places et Dimensions -->
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Numero Posti Totali *</label>
                                <input 
                                    type="number" 
                                    class="form-control" 
                                    v-model="form.posti_totali"
                                    min="1"
                                    required
                                >
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Dimensione Stand</label>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.dimensione_stand"
                                >
                            </div>
                        </div>
                        
                        <!-- URL Image -->
                        <div class="mb-3">
                            <label class="form-label">URL Immagine</label>
                            <input 
                                type="url" 
                                class="form-control" 
                                v-model="form.immagine"
                            >
                        </div>
                        
                        <!-- Requisiti Tecnici -->
                        <div class="mb-4">
                            <label class="form-label">Requisiti Tecnici</label>
                            
                            <input 
                                type="text" 
                                class="form-control mb-2" 
                                v-model="form.requisiti[0]"
                                placeholder="Requisito 1"
                            >
                            <input 
                                type="text" 
                                class="form-control mb-2" 
                                v-model="form.requisiti[1]"
                                placeholder="Requisito 2"
                            >
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="form.requisiti[2]"
                                placeholder="Requisito 3"
                            >
                        </div>
                        
                        <!-- Boutons -->
                        <div class="d-flex gap-3">
                            <RouterLink to="/dashboard/organizzatore" class="btn btn-outline-secondary">
                                Annulla
                            </RouterLink>
                            <button 
                                type="submit" 
                                class="btn btn-primary flex-grow-1"
                                :disabled="loading"
                            >
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                Salva modifiche
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventService } from '../services/api'

export default {
    name: 'EditEventView',
    
    data() {
        return {
            form: {
                titolo: '',
                descrizione: '',
                data_evento: '',
                citta: '',
                indirizzo: '',
                prezzo: '',
                posti_totali: '',
                dimensione_stand: '',
                immagine: '',
                requisiti: ['', '', '']
            },
            loadingEvent: true,
            loading: false,
            error: null
        }
    },
    
    methods: {
        // Charger l'événement existant
        async loadEvent() {
            try {
                this.loadingEvent = true
                const id = this.$route.params.id
                const event = await eventService.getById(id)
                
                // Remplir le formulaire
                this.form = {
                    titolo: event.titolo,
                    descrizione: event.descrizione,
                    data_evento: event.data_evento.split('T')[0], // Format YYYY-MM-DD
                    citta: event.citta,
                    indirizzo: event.indirizzo,
                    prezzo: event.prezzo,
                    posti_totali: event.posti_totali,
                    dimensione_stand: event.dimensione_stand || '',
                    immagine: event.immagine || '',
                    requisiti: [
                        event.requisiti?.[0] || '',
                        event.requisiti?.[1] || '',
                        event.requisiti?.[2] || ''
                    ]
                }
            } catch (err) {
                console.error('Erreur chargement événement:', err)
                this.error = 'Impossibile caricare l\'evento.'
            } finally {
                this.loadingEvent = false
            }
        },
        
        // Soumettre les modifications
        async handleSubmit() {
            try {
                this.loading = true
                this.error = null
                
                const requisiti = this.form.requisiti.filter(r => r.trim() !== '')
                
                const eventData = {
                    ...this.form,
                    requisiti: requisiti.length > 0 ? requisiti : null
                }
                
                await eventService.update(this.$route.params.id, eventData)
                
                this.$router.push('/dashboard/organizzatore')
                
            } catch (err) {
                console.error('Erreur modification:', err)
                this.error = err.response?.data?.error || 'Errore nella modifica dell\'evento.'
            } finally {
                this.loading = false
            }
        }
    },
    
    mounted() {
        this.loadEvent()
    }
}
</script>

