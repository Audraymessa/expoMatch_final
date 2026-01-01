// ============================================
// SERVER PRINCIPALE - ExpoMatch API
// ============================================
// Punto di ingresso dell'applicazione backend
// Configura Express e carica tutte le route

// ============================================
// 1. IMPORTAZIONE DEI MODULI
// ============================================

const express = require('express');  // Framework web per Node.js
const cors = require('cors');        // Consente le richieste cross-origin (frontend → backend)
require('dotenv').config();          // Carica le variabili d'ambiente

// Importazione della configurazione database
const { testConnection } = require('./config/database');

// Importazione delle route
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const candidaturaRoutes = require('./routes/candidaturaRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

// ============================================
// 2. INIZIALIZZAZIONE DI EXPRESS
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 3. MIDDLEWARE GLOBALI
// ============================================
// I middleware sono funzioni eseguite per ogni richiesta

// CORS: Consente al frontend (porta 5173) di comunicare con il backend
app.use(cors({
    origin: 'http://localhost:5173', // URL del frontend Vue.js
    credentials: true                 // Consente l'invio di cookie
}));

// Parse JSON: Converte automaticamente il body delle richieste in oggetto JavaScript
app.use(express.json());

// Parse URL-encoded: Per i formulari HTML classici
app.use(express.urlencoded({ extended: true }));

// Servire i file caricati (immagini)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// 4. ROUTE DELL'API
// ============================================
// Ogni gruppo di route è prefissato con /api

// Route di test - Verifica che il server funzioni
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Benvenuto su ExpoMatch API! 🎪',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            eventi: '/api/eventi',
            candidature: '/api/candidature'
        }
    });
});

// Route di autenticazione (login, register)
app.use('/api/auth', authRoutes);

// Route degli eventi (CRUD)
app.use('/api/eventi', eventRoutes);

// Route delle candidature
app.use('/api/candidature', candidaturaRoutes);

// Route di upload immagini
app.use('/api/upload', uploadRoutes);

// ============================================
// 5. GESTIONE ERRORI 404
// ============================================
// Se nessuna route corrisponde, restituire un errore 404

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route non trovata',
        path: req.path 
    });
});

// ============================================
// 6. AVVIO DEL SERVER
// ============================================

app.listen(PORT, async () => {
    console.log('============================================');
    console.log('🎪 ExpoMatch API Server');
    console.log('============================================');
    console.log(`📡 Server avviato su http://localhost:${PORT}`);
    console.log(`📡 API disponibile su http://localhost:${PORT}/api`);
    
    // Test della connessione al database
    await testConnection();
    
    console.log('============================================');
});

