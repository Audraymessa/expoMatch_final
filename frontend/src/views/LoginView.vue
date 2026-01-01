<!-- ============================================
     LOGIN VIEW - Pagina di Accesso
     ============================================
     Formulario di accesso per gli utenti esistenti
-->

<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="form-container">
                    <h2 class="text-center mb-4">Accedi</h2>
                    
                    <!-- Messaggio di errore -->
                    <div v-if="error" class="alert alert-danger">
                        {{ error }}
                    </div>
                    
                    <!-- Formulario di accesso -->
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
                        
                        <!-- Pulsante di accesso -->
                        <button 
                            type="submit" 
                            class="btn btn-primary w-100"
                            :disabled="loading"
                        >
                            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                            Accedi
                        </button>
                    </form>
                    
                    <!-- Link alla registrazione -->
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
                
                // Chiamata API di accesso
                const response = await authService.login(this.form)
                
                // Reindirizzamento al dashboard corretto in base al ruolo
                if (response.user.ruolo === 'organizzatore') {
                    this.$router.push('/dashboard/organizzatore')
                } else {
                    this.$router.push('/dashboard/venditore')
                }
                
            } catch (err) {
                console.error('Errore accesso:', err)
                this.error = err.response?.data?.error || 'Email o password non corretti.'
                // Mostrare anche in un alert per sicurezza
                alert('❌ ' + this.error)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

