<!-- ============================================
     LOGIN VIEW - Page de Connexion
     ============================================
     Formulaire de connexion pour les utilisateurs existants
-->

<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="form-container">
                    <h2 class="text-center mb-4">Accedi</h2>
                    
                    <!-- Message d'erreur -->
                    <div v-if="error" class="alert alert-danger">
                        {{ error }}
                    </div>
                    
                    <!-- Formulaire de connexion -->
                    <form @submit.prevent="handleLogin">
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
                                placeholder="La tua password"
                                required
                            >
                        </div>
                        
                        <!-- Bouton de connexion -->
                        <button 
                            type="submit" 
                            class="btn btn-primary w-100"
                            :disabled="loading"
                        >
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            Accedi
                        </button>
                    </form>
                    
                    <!-- Lien vers inscription -->
                    <p class="text-center mt-4 mb-0">
                        Non hai un account? 
                        <RouterLink to="/register">Registrati</RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { authService } from '../services/api'

export default {
    name: 'LoginView',
    
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            loading: false,
            error: null
        }
    },
    
    methods: {
        async handleLogin() {
            try {
                this.loading = true
                this.error = null
                
                // Appel API de connexion
                const response = await authService.login(this.form)
                
                // Redirection vers le bon dashboard selon le rôle
                if (response.user.ruolo === 'organizzatore') {
                    this.$router.push('/dashboard/organizzatore')
                } else {
                    this.$router.push('/dashboard/venditore')
                }
                
            } catch (err) {
                console.error('Erreur login:', err)
                this.error = err.response?.data?.error || 'Email o password non corretti.'
                // Afficher aussi dans une alerte pour être sûr
                alert('❌ ' + this.error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

