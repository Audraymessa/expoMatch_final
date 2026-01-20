<!-- ============================================
     CALENDARIO EVENTI
     ============================================
     Pagina che mostra gli eventi in formato calendario
     Per organizzatori: mostra gli eventi creati
     Per venditori: mostra gli eventi a cui si è candidato
-->

<template>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="h3 mb-2">Calendario Eventi</h1>
                <p class="text-muted mb-0">
                    {{ userRole === 'organizzatore' ? 'I tuoi eventi creati' : 'Eventi a cui ti sei candidato' }}
                </p>
            </div>
            <div class="d-flex gap-2 align-items-center">
                <button class="btn btn-outline-primary" @click="previousMonth">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <button class="btn btn-outline-primary" @click="goToToday">
                    Oggi
                </button>
                <button class="btn btn-outline-primary" @click="nextMonth">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- Selezione mese/anno -->
        <div class="text-center mb-4">
            <h2 class="h4 mb-0">{{ currentMonthYear }}</h2>
        </div>

        <!-- Caricamento -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Caricamento eventi...</p>
        </div>

        <!-- Errore -->
        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <!-- Calendario -->
        <div v-else class="calendar-container">
            <!-- Intestazione giorni della settimana -->
            <div class="calendar-header">
                <div 
                    v-for="day in weekDays" 
                    :key="day" 
                    class="calendar-day-header"
                >
                    {{ day }}
                </div>
            </div>

            <!-- Griglia del calendario -->
            <div class="calendar-grid">
                <!-- Giorni vuoti all'inizio del mese -->
                <div 
                    v-for="n in firstDayOfMonth" 
                    :key="`empty-${n}`" 
                    class="calendar-day empty"
                ></div>

                <!-- Giorni del mese -->
                <div 
                    v-for="day in daysInMonth" 
                    :key="day"
                    class="calendar-day"
                    :class="{
                        'today': isToday(day),
                        'has-events': getEventsForDay(day).length > 0
                    }"
                >
                    <div class="day-number">{{ day }}</div>
                    <div class="day-events">
                        <div 
                            v-for="(event, index) in getEventsForDay(day).slice(0, 3)" 
                            :key="event.id || index"
                            class="event-dot"
                            :class="getEventClass(event)"
                            :title="event.titolo"
                            @click="goToEvent(event)"
                        >
                            <span class="event-title-truncated">{{ truncateTitle(event.titolo) }}</span>
                        </div>
                        <div 
                            v-if="getEventsForDay(day).length > 3" 
                            class="event-more"
                        >
                            +{{ getEventsForDay(day).length - 3 }} altri
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista eventi del mese (mobile-friendly) -->
        <div class="events-list mt-4">
            <h5 class="mb-3">Eventi di {{ currentMonthYear }}</h5>
            <div v-if="filteredEvents.length === 0" class="text-center py-4 text-muted">
                <i class="bi bi-calendar-x display-4 d-block mb-3"></i>
                <p>Nessun evento questo mese</p>
            </div>
            <div v-else class="row g-3">
                <div 
                    v-for="event in filteredEvents" 
                    :key="event.id || event.evento_id"
                    class="col-md-6 col-lg-4"
                >
                    <div class="event-card calendar-event-card" @click="goToEvent(event)">
                        <div class="d-flex">
                            <div 
                                class="event-date-badge"
                                :class="getEventClass(event)"
                            >
                                <div class="event-day">{{ getEventDay(event) }}</div>
                                <div class="event-month">{{ getEventMonth(event) }}</div>
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">{{ event.titolo }}</h6>
                                <small class="text-muted d-block">
                                    <i class="bi bi-geo-alt me-1"></i>{{ event.citta }}
                                </small>
                                <small class="text-muted d-block mt-1">
                                    <i class="bi bi-currency-euro me-1"></i>{{ event.prezzo }}€
                                </small>
                                <span 
                                    v-if="userRole === 'venditore' && event.stato"
                                    :class="getStatusClass(event.stato)" 
                                    class="badge mt-2"
                                >
                                    {{ getStatusLabel(event.stato) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { eventService, candidaturaService } from '../services/api'
import { authService } from '../services/api'

export default {
    name: 'CalendarioView',
    
    data() {
        return {
            currentDate: new Date(),
            events: [],
            loading: true,
            error: null,
            userRole: null,
            weekDays: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
        }
    },
    
    computed: {
        currentMonthYear() {
            return this.currentDate.toLocaleDateString('it-IT', {
                month: 'long',
                year: 'numeric'
            }).replace(/^\w/, c => c.toUpperCase())
        },
        
        firstDayOfMonth() {
            const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1)
            return firstDay.getDay() // 0 = Domenica, 1 = Lunedì, ecc.
        },
        
        daysInMonth() {
            return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate()
        },
        
        filteredEvents() {
            const year = this.currentDate.getFullYear()
            const month = this.currentDate.getMonth()
            
            return this.events.filter(event => {
                const eventDate = new Date(event.data_evento)
                return eventDate.getFullYear() === year && eventDate.getMonth() === month
            }).sort((a, b) => {
                return new Date(a.data_evento) - new Date(b.data_evento)
            })
        }
    },
    
    methods: {
        // Caricare gli eventi in base al ruolo
        async loadEvents() {
            try {
                this.loading = true
                this.error = null
                
                const user = authService.getCurrentUser()
                this.userRole = user?.ruolo
                
                if (this.userRole === 'organizzatore') {
                    // Per organizzatori: caricare i loro eventi
                    this.events = await eventService.getMyEvents()
                } else if (this.userRole === 'venditore') {
                    // Per venditori: caricare le candidature (che includono info evento)
                    const candidature = await candidaturaService.getMyCandidature()
                    this.events = candidature
                } else {
                    this.error = 'Ruolo utente non riconosciuto'
                }
            } catch (err) {
                console.error('Errore caricamento eventi:', err)
                this.error = 'Impossibile caricare gli eventi.'
            } finally {
                this.loading = false
            }
        },
        
        // Ottenere gli eventi per un giorno specifico
        getEventsForDay(day) {
            const year = this.currentDate.getFullYear()
            const month = this.currentDate.getMonth()
            const date = new Date(year, month, day)
            
            return this.events.filter(event => {
                const eventDate = new Date(event.data_evento)
                return eventDate.toDateString() === date.toDateString()
            })
        },
        
        // Verificare se è oggi
        isToday(day) {
            const today = new Date()
            const year = this.currentDate.getFullYear()
            const month = this.currentDate.getMonth()
            
            return today.getDate() === day &&
                   today.getMonth() === month &&
                   today.getFullYear() === year
        },
        
        // Classe CSS per l'evento
        getEventClass(event) {
            if (this.userRole === 'venditore' && event.stato) {
                switch (event.stato) {
                    case 'approvata': return 'event-approved'
                    case 'rifiutata': return 'event-rejected'
                    case 'in_attesa': return 'event-pending'
                    default: return 'event-default'
                }
            }
            return 'event-default'
        },
        
        // Classe CSS per lo stato (venditore)
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
        
        // Troncare il titolo
        truncateTitle(title) {
            if (!title) return ''
            return title.length > 15 ? title.substring(0, 15) + '...' : title
        },
        
        // Giorno dell'evento
        getEventDay(event) {
            const date = new Date(event.data_evento)
            return date.getDate()
        },
        
        // Mese dell'evento
        getEventMonth(event) {
            const date = new Date(event.data_evento)
            return date.toLocaleDateString('it-IT', { month: 'short' })
        },
        
        // Navigare al mese precedente
        previousMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
        },
        
        // Navigare al mese successivo
        nextMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
        },
        
        // Tornare a oggi
        goToToday() {
            this.currentDate = new Date()
        },
        
        // Andare alla pagina dell'evento
        goToEvent(event) {
            const eventId = event.evento_id || event.id
            this.$router.push(`/evento/${eventId}`)
        }
    },
    
    mounted() {
        this.loadEvents()
    },
    
    watch: {
        currentDate() {
            // Quando cambia il mese, potremmo voler ricaricare gli eventi
            // Ma per ora manteniamo quelli già caricati
        }
    }
}
</script>

<style scoped>
/* ============================================
   CALENDARIO STYLES
   ============================================ */

.calendar-container {
    background: white;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-bottom: 30px;
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background-color: var(--light-bg);
    border-bottom: 2px solid var(--border-color);
}

.calendar-day-header {
    padding: 15px;
    text-align: center;
    font-weight: 600;
    color: var(--dark-text);
    font-size: 0.9rem;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
    min-height: 100px;
    border: 1px solid var(--border-color);
    padding: 8px;
    position: relative;
    background: white;
    transition: background-color 0.2s;
}

.calendar-day:hover {
    background-color: var(--light-bg);
}

.calendar-day.empty {
    background-color: var(--light-bg);
    border: none;
}

.calendar-day.today {
    background-color: rgba(67, 97, 238, 0.1);
    font-weight: bold;
}

.calendar-day.today .day-number {
    color: var(--primary-color);
    font-weight: bold;
}

.day-number {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 5px;
    color: var(--dark-text);
}

.day-events {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.event-dot {
    font-size: 0.75rem;
    padding: 3px 6px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.event-dot:hover {
    opacity: 0.8;
}

.event-title-truncated {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
}

.event-default {
    background-color: var(--primary-color);
    color: white;
}

.event-approved {
    background-color: var(--success-color);
    color: white;
}

.event-pending {
    background-color: var(--warning-color);
    color: var(--dark-text);
}

.event-rejected {
    background-color: var(--danger-color);
    color: white;
}

.event-more {
    font-size: 0.7rem;
    color: var(--secondary-color);
    font-style: italic;
}

/* Lista eventi */
.events-list {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--border-color);
}

.calendar-event-card {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.calendar-event-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.event-date-badge {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    flex-shrink: 0;
}

.event-date-badge.event-default {
    background-color: var(--primary-color);
}

.event-date-badge.event-approved {
    background-color: var(--success-color);
}

.event-date-badge.event-pending {
    background-color: var(--warning-color);
    color: var(--dark-text);
}

.event-date-badge.event-rejected {
    background-color: var(--danger-color);
}

.event-day {
    font-size: 1.5rem;
    line-height: 1;
}

.event-month {
    font-size: 0.75rem;
    text-transform: uppercase;
    margin-top: 2px;
}

/* Responsive */
@media (max-width: 768px) {
    .calendar-day {
        min-height: 80px;
        padding: 5px;
    }
    
    .day-number {
        font-size: 0.8rem;
    }
    
    .event-dot {
        font-size: 0.65rem;
        padding: 2px 4px;
    }
    
    .calendar-day-header {
        padding: 10px 5px;
        font-size: 0.8rem;
    }
}
</style>


