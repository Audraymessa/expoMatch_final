<!-- ============================================
     EVENT CARD - Carte d'Événement
     ============================================
     Composant réutilisable pour afficher un événement
     sous forme de carte (utilisé sur la homepage)
-->

<template>
    <div class="event-card">
        <!-- Image de l'événement -->
        <img 
            :src="event.immagine || defaultImage" 
            :alt="event.titolo"
            @error="handleImageError"
        >
        
        <div class="card-body">
            <!-- Titre de l'événement en gras -->
            <h5 class="event-title mb-2 fw-bold">{{ event.titolo }}</h5>
            
            <!-- Informations de l'événement -->
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
            
            <!-- Prix et bouton détails -->
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
    
    // Props = données passées par le composant parent
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    
    data() {
        return {
            // Image par défaut si aucune image n'est fournie
            defaultImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
        }
    },
    
    methods: {
        // Formater la date en format italien
        formatDate(dateString) {
            if (!dateString) return 'N/D'
            const date = new Date(dateString)
            return date.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        },
        
        // Gérer les erreurs de chargement d'image
        handleImageError(e) {
            e.target.src = this.defaultImage
        }
    }
}
</script>

