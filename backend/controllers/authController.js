// ============================================
// CONTROLLER DI AUTENTICAZIONE
// ============================================
// Gestisce la registrazione e l'accesso degli utenti
// Utilizza bcrypt per hashare le password
// Utilizza JWT per generare i token di sessione

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

// ============================================
// REGISTER - Registrazione di un nuovo utente
// ============================================
// POST /api/auth/register
// Body: { nome, email, password, ruolo }

const register = async (req, res) => {
    try {
        // 1. Estrarre i dati dal body della richiesta
        const { nome, email, password, ruolo, telefono, descrizione } = req.body;

        // 2. Validazione dei campi obbligatori
        if (!nome || !email || !password || !ruolo) {
            return res.status(400).json({ 
                error: 'Tutti i campi obbligatori devono essere compilati.' 
            });
        }

        // 3. Verificare che il ruolo sia valido
        if (!['organizzatore', 'venditore'].includes(ruolo)) {
            return res.status(400).json({ 
                error: 'Ruolo non valido. Scegliere organizzatore o venditore.' 
            });
        }

        // 4. Verificare se l'email esiste già
        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ 
                error: 'Email già registrata.' 
            });
        }

        // 5. Hashare la password con bcrypt
        // Il "10" è il numero di "salt rounds" (più = più sicuro ma più lento)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Inserire l'utente nel database
        const [result] = await pool.query(
            `INSERT INTO users (nome, email, password, ruolo, telefono, descrizione) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, email, hashedPassword, ruolo, telefono || null, descrizione || null]
        );

        // 7. Rispondere con successo (senza restituire la password)
        res.status(201).json({
            message: 'Registrazione completata con successo!',
            user: {
                id: result.insertId,
                nome,
                email,
                ruolo
            }
        });

    } catch (error) {
        console.error('Errore register:', error);
        res.status(500).json({ 
            error: 'Errore durante la registrazione.' 
        });
    }
};

// ============================================
// LOGIN - Accesso di un utente esistente
// ============================================
// POST /api/auth/login
// Body: { email, password }

const login = async (req, res) => {
    try {
        // 1. Estrarre email e password
        const { email, password } = req.body;

        // 2. Validazione
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email e password sono obbligatori.' 
            });
        }

        // 3. Cercare l'utente per email
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                error: 'Email o password non corretti.' 
            });
        }

        const user = users[0];

        // 4. Confrontare la password con l'hash memorizzato
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                error: 'Email o password non corretti.' 
            });
        }

        // 5. Creare il token JWT
        // Il token contiene le informazioni utente e scade in 24h
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                nome: user.nome,
                ruolo: user.ruolo
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 6. Rispondere con il token e le informazioni utente
        res.json({
            message: 'Login effettuato con successo!',
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                ruolo: user.ruolo
            }
        });

    } catch (error) {
        console.error('Errore login:', error);
        res.status(500).json({ 
            error: 'Errore durante il login.' 
        });
    }
};

// ============================================
// GET PROFILE - Recuperare il profilo dell'utente connesso
// ============================================
// GET /api/auth/profile
// Richiede: Token JWT valido

const getProfile = async (req, res) => {
    try {
        // req.user è aggiunto dal middleware verifyToken
        const [users] = await pool.query(
            'SELECT id, nome, email, ruolo, telefono, descrizione, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                error: 'Utente non trovato.' 
            });
        }

        res.json(users[0]);

    } catch (error) {
        console.error('Errore getProfile:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero del profilo.' 
        });
    }
};

module.exports = { register, login, getProfile };

