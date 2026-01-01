<!-- ============================================
     FOOTER - Pied de Page
     ============================================
     Composant simple pour le pied de page
-->

<template>
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <!-- Colonne logo et description -->
                <div class="col-md-4 mb-3">
                    <h5>
                        <i class="bi bi-grid-3x3-gap-fill me-2" style="color: #4361ee;"></i>
                        ExpoMatch
                    </h5>
                    <p class="text-muted small">
                        La piattaforma che connette venditori e organizzatori di eventi in tutta Italia.
                    </p>
                </div>
                
                <!-- Colonne liens utiles -->
                <div class="col-md-4 mb-3">
                    <h6>Link Utili</h6>
                    <ul class="list-unstyled">
                        <li><RouterLink to="/" class="text-muted">Home</RouterLink></li>
                        <li><a href="#chi-siamo" class="text-muted">Chi Siamo</a></li>
                        <li><RouterLink to="/register" class="text-muted">Registrati</RouterLink></li>
                    </ul>
                </div>
                
                <!-- Colonne contact -->
                <div class="col-md-4 mb-3">
                    <h6>Contatti</h6>
                    <ul class="list-unstyled text-muted">
                        <li><i class="bi bi-envelope me-2"></i>info@expomatch.it</li>
                        <li><i class="bi bi-telephone me-2"></i>+39 02 1234567</li>
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

