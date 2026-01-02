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
        
        <div v-else>
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
                        
                        <!-- Upload immagine -->
                        <div class="mb-3">
                            <label class="form-label">Immagine dell'evento</label>
                            
                            <!-- Zona di upload -->
                            <div 
                                class="upload-zone"
                                :class="{ 'has-image': imagePreview }"
                                @click="$refs.fileInput.click()"
                                @dragover.prevent
                                @drop.prevent="handleDrop"
                            >
                                <input 
                                    type="file" 
                                    ref="fileInput"
                                    @change="handleFileSelect"
                                    accept="image/*"
                                    hidden
                                >
                                
                                <!-- Anteprima immagine -->
                                <img v-if="imagePreview" :src="imagePreview" class="preview-image">
                                
                                <!-- Messaggio predefinito -->
                                <div v-else class="upload-placeholder">
                                    <i class="bi bi-cloud-upload display-4"></i>
                                    <p class="mb-0 mt-2">Clicca o trascina un'immagine</p>
                                    <small class="text-muted">JPG, PNG, GIF - Max 5MB</small>
                                </div>
                            </div>
                            
                            <!-- Pulsante rimuovi -->
                            <button 
                                v-if="imagePreview" 
                                type="button" 
                                class="btn btn-outline-danger btn-sm mt-2"
                                @click="removeImage"
                            >
                                <i class="bi bi-trash me-1"></i>Rimuovi immagine
                            </button>
                            
                            <!-- Messaggio di caricamento -->
                            <div v-if="uploadingImage" class="text-center mt-2">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                                <span class="ms-2">Caricamento...</span>
                            </div>
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
            error: null,
            imagePreview: null,      // Anteprima immagine
            uploadingImage: false    // Stato di caricamento
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
                
                // Mostrare l'anteprima dell'immagine esistente
                if (event.immagine) {
                    this.imagePreview = event.immagine
                }
            } catch (err) {
                console.error('Errore caricamento evento:', err)
                this.error = 'Impossibile caricare l\'evento.'
            } finally {
                this.loadingEvent = false
            }
        },
        
        // Gestire la selezione del file
        async handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                await this.uploadImage(file);
            }
        },
        
        // Gestire il drag & drop
        async handleDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                await this.uploadImage(file);
            }
        },
        
        // Caricare l'immagine sul server
        async uploadImage(file) {
            try {
                this.uploadingImage = true;
                
                // Creare un FormData per inviare il file
                const formData = new FormData();
                formData.append('image', file);
                
                // Inviare al server
                const response = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Memorizzare l'URL dell'immagine
                    this.form.immagine = data.imageUrl;
                    // Mostrare l'anteprima
                    this.imagePreview = data.imageUrl;
                } else {
                    alert('Errore: ' + data.error);
                }
                
            } catch (err) {
                console.error('Errore upload:', err);
                alert('Errore nel caricamento dell\'immagine');
            } finally {
                this.uploadingImage = false;
            }
        },
        
        // Rimuovere l'immagine
        removeImage() {
            this.form.immagine = '';
            this.imagePreview = null;
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
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

<style scoped>
.upload-zone {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: #f8f9fa;
}

.upload-zone:hover {
    border-color: #4361ee;
    background: #f0f4ff;
}

.upload-zone.has-image {
    padding: 10px;
    border-style: solid;
    border-color: #4361ee;
}

.upload-placeholder {
    color: #6c757d;
}

.upload-placeholder i {
    color: #4361ee;
}

.preview-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
}
</style>

