<!-- ============================================
     DASHBOARD ORGANIZZATORE
     ============================================
     Page privée pour les organizzatori
     Affiche les statistiques et la liste des événements
-->

<template>
    <div class="container py-4">
        <h1 class="h3 mb-2">Dashboard Organizzatore</h1>
        <p class="text-muted mb-4">Gestisci i tuoi eventi e richieste</p>
        
        <!-- Statistiques -->
        <div class="dashboard-stats">
            <div class="stat-card">
                <div>
                    <h3>Eventi totali</h3>
                    <div class="number">{{ events.length }}</div>
                </div>
                <i class="bi bi-calendar-event"></i>
            </div>
            
            <div class="stat-card">
                <div>
                    <h3>Posti totali</h3>
                    <div class="number">{{ totalPosti }}</div>
                </div>
                <i class="bi bi-people"></i>
            </div>
            
            <div class="stat-card">
                <div>
                    <h3>Richieste totali</h3>
                    <div class="number">{{ totalCandidature }}</div>
                </div>
                <i class="bi bi-envelope"></i>
            </div>
        </div>
        
        <!-- Bouton créer événement -->
        <RouterLink to="/evento/nuovo" class="btn btn-primary mb-4">
            <i class="bi bi-plus me-2"></i>Crea nuovo evento
        </RouterLink>
        
        <!-- Tableau des événements -->
        <div class="table-container">
            <h5 class="p-3 mb-0 border-bottom">I MIEI EVENTI</h5>
            
            <!-- Chargement -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
            
            <!-- Erreur -->
            <div v-else-if="error" class="alert alert-danger m-3">
                {{ error }}
            </div>
            
            <!-- Tableau -->
            <div v-else-if="events.length > 0" class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Titolo</th>
                            <th>Data</th>
                            <th>P. Totali</th>
                            <th>P. Occupati</th>
                            <th>Richieste</th>
                            <th>Azione</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="event in events" :key="event.id">
                            <td>{{ event.titolo }}</td>
                            <td>{{ formatDate(event.data_evento) }}</td>
                            <td>{{ event.posti_totali }}</td>
                            <td>{{ event.posti_occupati || 0 }}/{{ event.posti_totali }}</td>
                            <td>
                                <RouterLink 
                                    :to="`/evento/${event.id}/candidature`"
                                    class="badge bg-primary text-decoration-none"
                                >
                                    {{ event.num_candidature || 0 }} richieste
                                </RouterLink>
                            </td>
                            <td>
                                <RouterLink 
                                    :to="`/evento/modifica/${event.id}`"
                                    class="btn btn-sm btn-outline-secondary me-2"
                                    title="Modifica"
                                >
                                    <i class="bi bi-pencil"></i>
                                </RouterLink>
                                <button 
                                    class="btn btn-sm btn-outline-danger"
                                    @click="confirmDelete(event)"
                                    title="Elimina"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Aucun événement -->
            <div v-else class="text-center py-5">
                <i class="bi bi-calendar-x display-4 text-muted"></i>
                <p class="text-muted mt-3">Non hai ancora creato eventi</p>
                <RouterLink to="/evento/nuovo" class="btn btn-primary">
                    Crea il tuo primo evento
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
import { eventService } from '../services/api'

export default {
    name: 'DashboardOrganizzatore',
    
    data() {
        return {
            events: [],
            loading: true,
            error: null,
            eventToDelete: null
        }
    },
    
    computed: {
        // Total des places
        totalPosti() {
            return this.events.reduce((sum, e) => sum + (e.posti_totali || 0), 0)
        },
        
        // Total des candidatures
        totalCandidature() {
            return this.events.reduce((sum, e) => sum + (e.num_candidature || 0), 0)
        }
    },
    
    methods: {
        // Charger mes événements
        async loadEvents() {
            try {
                this.loading = true
                this.error = null
                this.events = await eventService.getMyEvents()
            } catch (err) {
                console.error('Erreur chargement événements:', err)
                this.error = 'Impossibile caricare gli eventi.'
            } finally {
                this.loading = false
            }
        },
        
        // Formater la date
        formatDate(dateString) {
            if (!dateString) return 'N/D'
            const date = new Date(dateString)
            return date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        },
        
        // Ouvrir modal de confirmation
        confirmDelete(event) {
            this.eventToDelete = event
            
            // Utiliser une confirmation simple qui fonctionne toujours
            if (confirm(`Sei sicuro di voler eliminare l'evento "${event.titolo}"?`)) {
                this.deleteEvent()
            }
        },
        
        // Supprimer l'événement
        async deleteEvent() {
            if (!this.eventToDelete) return
            
            try {
                await eventService.delete(this.eventToDelete.id)
                
                // Recharger la liste
                await this.loadEvents()
                
                // Message de succès
                alert('✅ Evento eliminato con successo!')
                
                // Réinitialiser
                this.eventToDelete = null
                
            } catch (err) {
                console.error('Erreur suppression:', err)
                const errorMsg = err.response?.data?.error || err.message || 'Errore sconosciuto'
                alert('❌ Errore nell\'eliminazione dell\'evento:\n' + errorMsg)
            }
        }
    },
    
    mounted() {
        this.loadEvents()
    }
}
</script>

