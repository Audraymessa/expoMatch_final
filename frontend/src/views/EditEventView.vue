<!-- ============================================
     EDIT EVENT VIEW - Modificare un Evento
     ============================================
     Formulario per modificare un evento esistente
     Riservato agli organizzatori (proprietario)
-->

<template>
    <div class="container py-4">
        <!-- Link di ritorno -->
        <RouterLink to="/dashboard/organizzatore" class="text-primary text-decoration-none mb-4 d-inline-block">
            <i class="bi bi-arrow-left me-2"></i>Torna al Dashboard
        </RouterLink>
        
        <!-- Caricamento -->
        <div v-if="loadingEvent" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
        
        <div v-else class="row justify-content-center">
            <div class="col-lg-8">
                <div class="form-container">
                    <h2 class="mb-4">Modifica Evento</h2>
                    
                    <!-- Messaggio di errore -->
                    <div v-if="error" class="alert alert-danger">
                        {{ error }}
                    </div>
                    
                    <!-- Formulario -->
                    <form @submit.prevent="handleSubmit">
                        <!-- Titolo -->
                        <div class="mb-3">
                            <label class="form-label">Titolo Evento *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="form.titolo"
                                required
                            >
                        </div>
                        
                        <!-- Descrizione -->
                        <div class="mb-3">
                            <label class="form-label">Descrizione *</label>
                            <textarea 
                                class="form-control" 
                                v-model="form.descrizione"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        
                        <!-- Indirizzo e Città -->
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
                        
                        <!-- Data e Prezzo -->
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
                        
                        <!-- Numero posti e Dimensioni -->
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
                        
                        <!-- URL Immagine -->
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
                        
                        <!-- Pulsanti -->
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
        // Caricare l'evento esistente
        async loadEvent() {
            try {
                this.loadingEvent = true
                const id = this.$route.params.id
                const event = await eventService.getById(id)
                
                // Compilare il formulario
                this.form = {
                    titolo: event.titolo,
                    descrizione: event.descrizione,
                    data_evento: event.data_evento.split('T')[0], // Formato YYYY-MM-DD
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
                console.error('Errore caricamento evento:', err)
                this.error = 'Impossibile caricare l\'evento.'
            } finally {
                this.loadingEvent = false
            }
        },
        
        // Inviare le modifiche
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
                console.error('Errore modifica:', err)
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

