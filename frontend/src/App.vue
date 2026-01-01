<!-- ============================================
     APP.VUE - Componente Radice dell'Applicazione
     ============================================
     Questo componente contiene la struttura globale:
     - Navbar (navigazione)
     - RouterView (contenuto della pagina corrente)
     - Footer
-->

<template>
    <div id="app">
        <!-- Barra di navigazione -->
        <Navbar />
        
        <!-- Contenuto principale (cambia in base alla route) -->
        <main>
            <RouterView />
        </main>
        
        <!-- Piè di pagina -->
        <Footer />
    </div>
</template>

<script>
// Importazione dei componenti
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
    name: 'App',
    // Dichiarazione dei componenti utilizzati
    components: {
        Navbar,
        Footer
    }
}
</script>

<style>
/* Stile globale per l'app */
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;
}
</style>

