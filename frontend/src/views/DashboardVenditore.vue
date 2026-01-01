<!-- ============================================
     DASHBOARD VENDITORE
     ============================================
     Pagina privata per i venditori
     Mostra l'elenco delle loro candidature
-->

<template>
    <div class="container py-4">
        <h1 class="h3 mb-2">Dashboard Venditore</h1>
        <p class="text-muted mb-4">Gestisci le tue candidature</p>
        
        <!-- Statistiques -->
        <div class="dashboard-stats">
            <div class="stat-card">
                <div>
                    <h3>Candidature totali</h3>
                    <div class="number">{{ candidature.length }}</div>
                </div>
                <i class="bi bi-send"></i>
            </div>
            
            <div class="stat-card">
                <div>
                    <h3>In attesa</h3>
                    <div class="number">{{ candidatureInAttesa }}</div>
                </div>
                <i class="bi bi-hourglass-split"></i>
            </div>
            
            <div class="stat-card">
                <div>
                    <h3>Approvate</h3>
                    <div class="number">{{ candidatureApprovate }}</div>
                </div>
                <i class="bi bi-check-circle"></i>
            </div>
        </div>
        
        <!-- Link alla ricerca eventi -->
        <RouterLink to="/" class="btn btn-primary mb-4">
            <i class="bi bi-search me-2"></i>Cerca nuovi eventi
        </RouterLink>
        
        <!-- Elenco delle candidature -->
        <div class="table-container">
            <h5 class="p-3 mb-0 border-bottom">LE MIE CANDIDATURE</h5>
            
            <!-- Caricamento -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
            
            <!-- Errore -->
            <div v-else-if="error" class="alert alert-danger m-3">
                {{ error }}
            </div>
            
            <!-- Elenco -->
            <div v-else-if="candidature.length > 0">
                <div 
                    v-for="cand in candidature" 
                    :key="cand.id"
                    class="p-3 border-bottom d-flex align-items-center"
                >
                    <!-- Immagine evento -->
                    <img 
                        :src="cand.immagine || defaultImage" 
                        class="rounded me-3"
                        style="width: 80px; height: 60px; object-fit: cover;"
                        @error="handleImageError"
                    >
                    
                    <!-- Informazioni -->
                    <div class="flex-grow-1">
                        <h6 class="mb-1">{{ cand.titolo }}</h6>
                        <small class="text-muted">
                            <i class="bi bi-calendar me-1"></i>{{ formatDate(cand.data_evento) }}
                            <span class="mx-2">|</span>
                            <i class="bi bi-geo-alt me-1"></i>{{ cand.citta }}
                            <span class="mx-2">|</span>
                            <i class="bi bi-currency-euro me-1"></i>{{ cand.prezzo }}€
                        </small>
                    </div>
                    
                    <!-- Stato -->
                    <span :class="getStatusClass(cand.stato)" class="badge me-3">
                        {{ getStatusLabel(cand.stato) }}
                    </span>
                    
                    <!-- Azioni -->
                    <div>
                        <RouterLink 
                            :to="`/evento/${cand.evento_id}`"
                            class="btn btn-sm btn-outline-primary me-2"
                        >
                            Dettagli
                        </RouterLink>
                        <button 
                            class="btn btn-sm btn-outline-danger"
                            @click="confirmDelete(cand)"
                            :disabled="cand.stato === 'approvata'"
                            :title="cand.stato === 'approvata' ? 'Non puoi ritirare una candidatura approvata' : 'Ritira candidatura'"
                        >
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Nessuna candidatura -->
            <div v-else class="text-center py-5">
                <i class="bi bi-inbox display-4 text-muted"></i>
                <p class="text-muted mt-3">Non hai ancora inviato candidature</p>
                <RouterLink to="/" class="btn btn-primary">
                    Cerca eventi
                </RouterLink>
            </div>
        </div>
        
        <!-- Modal di conferma eliminazione -->
        <div class="modal fade" id="deleteModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ritira candidatura</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Sei sicuro di voler ritirare la candidatura per "{{ candidaturaToDelete?.titolo }}"?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Annulla
                        </button>
                        <button type="button" class="btn btn-danger" @click="deleteCandidatura">
                            Ritira
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { candidaturaService } from '../services/api'

export default {
    name: 'DashboardVenditore',
    
    data() {
        return {
            candidature: [],
            loading: true,
            error: null,
            defaultImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
            candidaturaToDelete: null,
            deleteModal: null
        }
    },
    
    computed: {
        candidatureInAttesa() {
            return this.candidature.filter(c => c.stato === 'in_attesa').length
        },
        candidatureApprovate() {
            return this.candidature.filter(c => c.stato === 'approvata').length
        }
    },
    
    methods: {
        // Caricare le mie candidature
        async loadCandidature() {
            try {
                this.loading = true
                this.error = null
                this.candidature = await candidaturaService.getMyCandidature()
            } catch (err) {
                console.error('Errore caricamento candidature:', err)
                this.error = 'Impossibile caricare le candidature.'
            } finally {
                this.loading = false
            }
        },
        
        // Formattare la data
        formatDate(dateString) {
            if (!dateString) return 'N/D'
            const date = new Date(dateString)
            return date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short',
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
        },
        
        // Gestire errore immagine
        handleImageError(e) {
            e.target.src = this.defaultImage
        },
        
        // Aprire modal di conferma
        confirmDelete(cand) {
            this.candidaturaToDelete = cand
            const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'))
            this.deleteModal = modal
            modal.show()
        },
        
        // Eliminare la candidatura
        async deleteCandidatura() {
            try {
                await candidaturaService.delete(this.candidaturaToDelete.id)
                this.deleteModal.hide()
                await this.loadCandidature()
            } catch (err) {
                console.error('Errore eliminazione:', err)
                alert('Errore nel ritiro della candidatura')
            }
        }
    },
    
    mounted() {
        this.loadCandidature()
    }
}
</script>

