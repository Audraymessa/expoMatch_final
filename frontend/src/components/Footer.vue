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
                    <h5 class="d-flex align-items-center">
                        <img src="../assets/logo.png" alt="ExpoMatch Logo" style="height: 30px; margin-right: 10px;">
                        ExpoMatch
                    </h5>
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
                </div>
                
                <!-- Colonna contatti -->
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

