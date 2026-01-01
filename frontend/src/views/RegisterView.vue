<!-- ============================================
     REGISTER VIEW - Page d'Inscription
     ============================================
     Formulaire d'inscription pour les nouveaux utilisateurs
     Permet de choisir entre Organizzatore et Venditore
-->

<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="form-container">
                    <h2 class="text-center mb-4">Registrati</h2>
                    
                    <!-- Message d'erreur -->
                    <div v-if="error" class="alert alert-danger">
                        {{ error }}
                    </div>
                    
                    <!-- Message de succès -->
                    <div v-if="success" class="alert alert-success">
                        {{ success }}
                    </div>
                    
                    <!-- Formulaire d'inscription -->
                    <form @submit.prevent="handleRegister">
                        <!-- Choix du rôle -->
                        <div class="mb-4">
                            <label class="form-label">Tipo di account *</label>
                            <div class="d-flex gap-3">
                                <div class="form-check">
                                    <input 
                                        class="form-check-input" 
                                        type="radio" 
                                        id="ruolo-organizzatore"
                                        value="organizzatore"
                                        v-model="form.ruolo"
                                    >
                                    <label class="form-check-label" for="ruolo-organizzatore">
                                        <i class="bi bi-calendar-event me-1"></i>
                                        Organizzatore
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input 
                                        class="form-check-input" 
                                        type="radio" 
                                        id="ruolo-venditore"
                                        value="venditore"
                                        v-model="form.ruolo"
                                    >
                                    <label class="form-check-label" for="ruolo-venditore">
                                        <i class="bi bi-shop me-1"></i>
                                        Venditore
                                    </label>
                                </div>
                            </div>
                            <small class="text-muted">
                                {{ form.ruolo === 'organizzatore' 
                                    ? 'Potrai creare e gestire eventi' 
                                    : 'Potrai candidarti agli eventi' }}
                            </small>
                        </div>
                        
                        <!-- Nom -->
                        <div class="mb-3">
                            <label class="form-label">Nome completo *</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                v-model="form.nome"
                                placeholder="es: Mario Rossi"
                                required
                            >
                        </div>
                        
                        <!-- Email -->
                        <div class="mb-3">
                            <label class="form-label">Email *</label>
                            <input 
                                type="email" 
                                class="form-control" 
                                v-model="form.email"
                                placeholder="es: mario@email.com"
                                required
                            >
                        </div>
                        
                        <!-- Password -->
                        <div class="mb-3">
                            <label class="form-label">Password *</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                v-model="form.password"
                                placeholder="Minimo 6 caratteri"
                                minlength="6"
                                required
                            >
                        </div>
                        
                        <!-- Téléphone (optionnel) -->
                        <div class="mb-3">
                            <label class="form-label">Telefono</label>
                            <input 
                                type="tel" 
                                class="form-control" 
                                v-model="form.telefono"
                                placeholder="es: +39 333 1234567"
                            >
                        </div>
                        
                        <!-- Description (pour venditori) -->
                        <div class="mb-3" v-if="form.ruolo === 'venditore'">
                            <label class="form-label">Descrizione attività</label>
                            <textarea 
                                class="form-control" 
                                v-model="form.descrizione"
                                rows="3"
                                placeholder="Descrivi la tua attività, i prodotti che vendi..."
                            ></textarea>
                        </div>
                        
                        <!-- Bouton d'inscription -->
                        <button 
                            type="submit" 
                            class="btn btn-primary w-100"
                            :disabled="loading"
                        >
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            Registrati
                        </button>
                    </form>
                    
                    <!-- Lien vers connexion -->
                    <p class="text-center mt-4 mb-0">
                        Hai già un account? 
                        <RouterLink to="/login">Accedi</RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { authService } from '../services/api'

export default {
    name: 'RegisterView',
    
    data() {
        return {
            form: {
                nome: '',
                email: '',
                password: '',
                ruolo: 'venditore',  // Par défaut
                telefono: '',
                descrizione: ''
            },
            loading: false,
            error: null,
            success: null
        }
    },
    
    methods: {
        async handleRegister() {
            try {
                this.loading = true
                this.error = null
                this.success = null
                
                // Appel API d'inscription
                await authService.register(this.form)
                
                // Afficher message de succès
                this.success = 'Registrazione completata! Ora puoi accedere.'
                
                // Rediriger vers login après 2 secondes
                setTimeout(() => {
                    this.$router.push('/login')
                }, 2000)
                
            } catch (err) {
                console.error('Erreur register:', err)
                this.error = err.response?.data?.error || 'Errore durante la registrazione.'
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

