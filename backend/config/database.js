// ============================================
// CONFIGURATION DE LA BASE DE DONNÉES MySQL
// ============================================
// Ce fichier gère la connexion à la base de données MySQL
// Il utilise mysql2 avec le support des Promesses pour async/await

// Importation du module mysql2 avec support Promise
const mysql = require('mysql2/promise');

// Chargement des variables d'environnement depuis .env
require('dotenv').config();

// ============================================
// Création du pool de connexions
// ============================================
// Un "pool" permet de réutiliser les connexions au lieu d'en créer
// une nouvelle à chaque requête (plus performant)

const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Adresse du serveur MySQL (localhost)
    user: process.env.DB_USER,         // Nom d'utilisateur MySQL (root)
    password: process.env.DB_PASSWORD, // Mot de passe MySQL
    database: process.env.DB_NAME,     // Nom de la base de données (expomatch)
    waitForConnections: true,          // Attendre si toutes les connexions sont utilisées
    connectionLimit: 10,               // Maximum 10 connexions simultanées
    queueLimit: 0                      // Pas de limite sur la file d'attente
});

// ============================================
// Fonction de test de connexion
// ============================================
// Appelée au démarrage pour vérifier que MySQL fonctionne

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connexion MySQL réussie !');
        connection.release(); // Libérer la connexion
    } catch (error) {
        console.error('❌ Erreur connexion MySQL:', error.message);
    }
}

// Exporter le pool pour l'utiliser dans les controllers
module.exports = { pool, testConnection };

