<!-- ============================================
     CANDIDATURE EVENT VIEW - Gestire le Candidature
     ============================================
     Mostra le candidature di un evento
     Permette di approvare o rifiutare le richieste
-->

<template>
    <div class="container py-4">
        <!-- Link di ritorno -->
        <RouterLink to="/dashboard/organizzatore" class="text-primary text-decoration-none mb-4 d-inline-block">
            <i class="bi bi-arrow-left me-2"></i>Torna al Dashboard
        </RouterLink>
        
        <h1 class="h3 mb-2">Gestione Candidature</h1>
        <p class="text-muted mb-4" v-if="evento">{{ evento.titolo }}</p>
        
        <!-- Caricamento -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
        
        <!-- Errore -->
        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>
        
        <!-- Elenco delle candidature -->
        <div v-else class="table-container">
            <div v-if="candidature.length > 0">
                <div 
                    v-for="cand in candidature" 
                    :key="cand.id"
                    class="p-4 border-bottom"
                >
                    <div class="d-flex justify-content-between align-items-start">
                        <!-- Informazioni venditore -->
                        <div>
                            <h5 class="mb-1">{{ cand.venditore_nome }}</h5>
                            <p class="text-muted mb-2">
                                <i class="bi bi-envelope me-2"></i>{{ cand.venditore_email }}
                                <span v-if="cand.venditore_telefono" class="ms-3">
                                    <i class="bi bi-telephone me-2"></i>{{ cand.venditore_telefono }}
                                </span>
                            </p>
                            
                            <!-- Descrizione del venditore -->
                            <p v-if="cand.venditore_descrizione" class="mb-2">
                                <strong>Attività:</strong> {{ cand.venditore_descrizione }}
                            </p>
                            
                            <!-- Messaggio di candidatura -->
                            <p v-if="cand.messaggio" class="mb-2 fst-italic">
                                "{{ cand.messaggio }}"
                            </p>
                            
                            <small class="text-muted">
                                Candidatura inviata il {{ formatDate(cand.created_at) }}
                            </small>
                        </div>
                        
                        <!-- Stato e azioni -->
                        <div class="text-end">
                            <span :class="getStatusClass(cand.stato)" class="badge mb-3 d-block">
                                {{ getStatusLabel(cand.stato) }}
                            </span>
                            
                            <!-- Pulsanti di azione (solo se in attesa) -->
                            <div v-if="cand.stato === 'in_attesa'" class="d-flex gap-2">
                                <button 
                                    class="btn btn-success btn-sm"
                                    @click="updateStatus(cand.id, 'approvata')"
                                    :disabled="cand.updating"
                                >
                                    <i class="bi bi-check-lg me-1"></i>Approva
                                </button>
                                <button 
                                    class="btn btn-danger btn-sm"
                                    @click="updateStatus(cand.id, 'rifiutata')"
                                    :disabled="cand.updating"
                                >
                                    <i class="bi bi-x-lg me-1"></i>Rifiuta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Nessuna candidatura -->
            <div v-else class="text-center py-5">
                <i class="bi bi-inbox display-4 text-muted"></i>
                <p class="text-muted mt-3">Nessuna candidatura ricevuta per questo evento</p>
            </div>
        </div>
    </div>
</template>

<script>
import { candidaturaService, eventService } from '../services/api'

export default {
    name: 'CandidatureEventView',
    
    data() {
        return {
            evento: null,
            candidature: [],
            loading: true,
            error: null
        }
    },
    
    methods: {
        // Caricare l'evento e le sue candidature
        async loadData() {
            try {
                this.loading = true
                this.error = null
                
                const eventoId = this.$route.params.id
                
                // Caricare l'evento
                this.evento = await eventService.getById(eventoId)
                
                // Caricare le candidature
                this.candidature = await candidaturaService.getEventCandidature(eventoId)
                
            } catch (err) {
                console.error('Errore caricamento:', err)
                this.error = 'Impossibile caricare le candidature.'
            } finally {
                this.loading = false
            }
        },
        
        // Aggiornare lo stato di una candidatura
        async updateStatus(candidaturaId, stato) {
            try {
                // Trovare la candidatura e marcare come "updating"
                const cand = this.candidature.find(c => c.id === candidaturaId)
                if (cand) cand.updating = true
                
                await candidaturaService.updateStatus(candidaturaId, stato)
                
                // Aggiornare localmente
                if (cand) {
                    cand.stato = stato
                    cand.updating = false
                }
                
            } catch (err) {
                console.error('Errore aggiornamento:', err)
                alert(err.response?.data?.error || 'Errore nell\'aggiornamento')
                const cand = this.candidature.find(c => c.id === candidaturaId)
                if (cand) cand.updating = false
            }
        },
        
        // Formattare la data
        formatDate(dateString) {
            if (!dateString) return 'N/D'
            const date = new Date(dateString)
            return date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        },
        
        // Classe CSS in base allo stato
        getStatusClass(stato) {
            switch (stato) {
                case 'in_attesa': return 'badge-attesa'
                case 'approvata': return 'badge-approvata'
                case 'rifiutata': return 'badge-rifiutata'
                default: return 'bg-secondary'
            }
        },
        
        // Etichetta dello stato
        getStatusLabel(stato) {
            switch (stato) {
                case 'in_attesa': return 'In attesa'
                case 'approvata': return 'Approvata'
                case 'rifiutata': return 'Rifiutata'
                default: return stato
            }
        }
    },
    
    mounted() {
        this.loadData()
    }
}
</script>

