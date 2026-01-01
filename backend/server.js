// ============================================
// SERVEUR PRINCIPAL - ExpoMatch API
// ============================================
// Point d'entrée de l'application backend
// Configure Express et charge toutes les routes

// ============================================
// 1. IMPORTATION DES MODULES
// ============================================

const express = require('express');  // Framework web pour Node.js
const cors = require('cors');        // Permet les requêtes cross-origin (frontend → backend)
require('dotenv').config();          // Charge les variables d'environnement

// Importation de la configuration base de données
const { testConnection } = require('./config/database');

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const candidaturaRoutes = require('./routes/candidaturaRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

// ============================================
// 2. INITIALISATION D'EXPRESS
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 3. MIDDLEWARES GLOBAUX
// ============================================
// Les middlewares sont des fonctions exécutées pour chaque requête

// CORS: Autorise le frontend (port 5173) à communiquer avec le backend
app.use(cors({
    origin: 'http://localhost:5173', // URL du frontend Vue.js
    credentials: true                 // Autorise l'envoi de cookies
}));

// Parse JSON: Convertit automatiquement le body des requêtes en objet JavaScript
app.use(express.json());

// Parse URL-encoded: Pour les formulaires HTML classiques
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// 4. ROUTES DE L'API
// ============================================
// Chaque groupe de routes est préfixé par /api

// Route de test - Vérifie que le serveur fonctionne
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

// Routes d'authentification (login, register)
app.use('/api/auth', authRoutes);

// Routes des événements (CRUD)
app.use('/api/eventi', eventRoutes);

// Routes des candidatures
app.use('/api/candidature', candidaturaRoutes);

// Routes d'upload d'images
app.use('/api/upload', uploadRoutes);

// ============================================
// 5. GESTION DES ERREURS 404
// ============================================
// Si aucune route ne correspond, renvoyer une erreur 404

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route non trouvée',
        path: req.path 
    });
});

// ============================================
// 6. DÉMARRAGE DU SERVEUR
// ============================================

app.listen(PORT, async () => {
    console.log('============================================');
    console.log('🎪 ExpoMatch API Server');
    console.log('============================================');
    console.log(`📡 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
    
    // Test de la connexion à la base de données
    await testConnection();
    
    console.log('============================================');
});

