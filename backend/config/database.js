// ============================================
// CONFIGURAZIONE DEL DATABASE MySQL
// ============================================
// Questo file gestisce la connessione al database MySQL
// Utilizza mysql2 con il supporto delle Promise per async/await

// Importazione del modulo mysql2 con supporto Promise
const mysql = require('mysql2/promise');

// Caricamento delle variabili d'ambiente da .env
require('dotenv').config();

// ============================================
// Creazione del pool di connessioni
// ============================================
// Un "pool" consente di riutilizzare le connessioni invece di crearne
// una nuova ad ogni richiesta (più performante)

const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Indirizzo del server MySQL (localhost)
    user: process.env.DB_USER,         // Nome utente MySQL (root)
    password: process.env.DB_PASSWORD, // Password MySQL
    database: process.env.DB_NAME,     // Nome del database (expomatch)
    waitForConnections: true,          // Attendere se tutte le connessioni sono utilizzate
    connectionLimit: 10,               // Massimo 10 connessioni simultanee
    queueLimit: 0                      // Nessun limite sulla coda di attesa
});

// ============================================
// Funzione di test di connessione
// ============================================
// Chiamata all'avvio per verificare che MySQL funzioni

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connessione MySQL riuscita!');
        connection.release(); // Liberare la connessione
    } catch (error) {
        console.error('❌ Errore connessione MySQL:', error.message);
    }
}

// Esportare il pool per utilizzarlo nei controller
module.exports = { pool, testConnection };

