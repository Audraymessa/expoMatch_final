<!-- ============================================
     APP.VUE - Composant Racine de l'Application
     ============================================
     Ce composant contient la structure globale:
     - Navbar (navigation)
     - RouterView (contenu de la page actuelle)
     - Footer
-->

<template>
    <div id="app">
        <!-- Barre de navigation -->
        <Navbar />
        
        <!-- Contenu principal (change selon la route) -->
        <main>
            <RouterView />
        </main>
        
        <!-- Pied de page -->
        <Footer />
    </div>
</template>

<script>
// Importation des composants
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
    name: 'App',
    // Déclaration des composants utilisés
    components: {
        Navbar,
        Footer
    }
}
</script>

<style>
/* Style global pour l'app */
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;
}
</style>

