<!-- ============================================
     EVENT CARD - Card Evento
     ============================================
     Componente riutilizzabile per visualizzare un evento
     sotto forma di card (utilizzato nella homepage)
-->

<template>
    <div class="event-card">
        <!-- Immagine dell'evento -->
        <img 
            :src="event.immagine || defaultImage" 
            :alt="event.titolo"
            @error="handleImageError"
        >
        
        <div class="card-body">
            <!-- Titolo dell'evento in grassetto -->
            <h5 class="event-title mb-2 fw-bold">{{ event.titolo }}</h5>
            
            <!-- Informazioni dell'evento -->
            <div class="event-info">
                <i class="bi bi-calendar"></i>
                <span>{{ formatDate(event.data_evento) }}</span>
            </div>
            
            <div class="event-info">
                <i class="bi bi-geo-alt"></i>
                <span>{{ event.citta }}</span>
            </div>
            
            <div class="event-info">
                <i class="bi bi-people"></i>
                <span>{{ event.posti_disponibili }} posti disponibili</span>
            </div>
            
            <div class="event-info">
                <i class="bi bi-aspect-ratio"></i>
                <span>{{ event.dimensione_stand || 'N/D' }}</span>
            </div>
            
            <!-- Prezzo e pulsante dettagli -->
            <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="event-price">{{ event.prezzo }}€</span>
                <RouterLink 
                    :to="`/evento/${event.id}`" 
                    class="btn btn-outline-primary btn-sm"
                >
                    Dettagli
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EventCard',
    
    // Props = dati passati dal componente padre
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    
    data() {
        return {
            // Immagine predefinita se nessuna immagine è fornita
            defaultImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
        }
    },
    
    methods: {
        // Formattare la data in formato italiano
        formatDate(dateString) {
            if (!dateString) return 'N/D'
            const date = new Date(dateString)
            return date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        },
        
        // Gestire gli errori di caricamento immagine
        handleImageError(e) {
            e.target.src = this.defaultImage
        }
    }
}
</script>

