// CONFIGURAZIONE DEL DATABASE MySQL

// Importazione del modulo mysql2 con supporto Promise
const mysql = require('mysql2/promise');

// Caricamento delle variabili d'ambiente da .env
require('dotenv').config();

// crea un pool di connessioni tra backend (nodejs) e database (mysql) 
/* tutte quelle scritte process.env.DB_HOST, process.env.DB_USER, eccQuesto file sta dicendo: "Non scrivere la password qui in chiaro! Valla a leggere dal file .env che abbiamo protetto prima con il .gitignore*/

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
        const connection = await pool.getConnection(); //se tutto Apposto stampa questo
        console.log(' Connessione MySQL riuscita!');
        connection.release(); // Liberare la connessione
    } catch (error) {
        console.error(' Errore connessione MySQL:', error.message);
    }
}

// Esportare il pool per utilizzarlo nei controller
module.exports = { pool, testConnection };

