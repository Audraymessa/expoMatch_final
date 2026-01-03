<!-- ============================================
     FOOTER - Piè di Pagina
     ============================================
     Componente semplice per il piè di pagina
-->

<template>
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <!-- Colonna logo e descrizione -->
                <div class="col-md-4 mb-3">
                    <h5>ExpoMatch</h5>
                    <p class="text-muted small">
                        La piattaforma che connette venditori e organizzatori di eventi in tutta Italia.
                    </p>
                </div>
                
                <!-- Colonna link utili -->
                <div class="col-md-4 mb-3">
                    <h6>Link Utili</h6>
                    <ul class="list-unstyled">
                        <li><RouterLink to="/" class="text-muted">Home</RouterLink></li>
                        <li><a href="#chi-siamo" class="text-muted">Chi Siamo</a></li>
                        <li><RouterLink to="/register" class="text-muted">Registrati</RouterLink></li>
                    </ul>
                    <!-- Social Media -->
                    <div class="d-flex gap-3" style="margin-top: 0.25rem;">
                        <a href="#" class="text-light social-icon" style="font-size: 1.5rem;" title="Instagram">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a href="#" class="text-light social-icon" style="font-size: 1.5rem;" title="Facebook">
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a href="#" class="text-light social-icon" style="font-size: 1.5rem;" title="TikTok">
                            <i class="bi bi-tiktok"></i>
                        </a>
                    </div>
                </div>
                
                <!-- Colonna contatti -->
                <div class="col-md-4 mb-3">
                    <h6>Contatti</h6>
                    <ul class="list-unstyled">
                        <li class="text-light"><i class="bi bi-envelope me-2"></i>expomatch@gmail.com</li>
                        <li class="text-light"><i class="bi bi-telephone me-2"></i>+39 02 1234567</li>
                    </ul>
                </div>
            </div>
            
            <hr class="border-secondary">
            
            <!-- Copyright -->
            <div class="text-center text-muted small">
                © 2025 ExpoMatch - Progetto Universitario
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style scoped>
/* Stili per le icone social */
.social-icon {
    transition: transform 0.3s ease, color 0.3s ease;
    display: inline-block;
    text-decoration: none;
}

.social-icon:hover {
    transform: translateY(-3px) scale(1.1);
}

.social-icon:hover .bi-instagram {
    color: #E4405F !important;
}

.social-icon:hover .bi-facebook {
    color: #1877F2 !important;
}

.social-icon:hover .bi-tiktok {
    color: #000000 !important;
}
</style>

