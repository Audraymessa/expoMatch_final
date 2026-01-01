// ============================================
// CONTROLLER D'AUTHENTIFICATION
// ============================================
// Gère l'inscription et la connexion des utilisateurs
// Utilise bcrypt pour hasher les mots de passe
// Utilise JWT pour générer les tokens de session

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

// ============================================
// REGISTER - Inscription d'un nouvel utilisateur
// ============================================
// POST /api/auth/register
// Body: { nome, email, password, ruolo }

const register = async (req, res) => {
    try {
        // 1. Extraire les données du body de la requête
        const { nome, email, password, ruolo, telefono, descrizione } = req.body;

        // 2. Validation des champs obligatoires
        if (!nome || !email || !password || !ruolo) {
            return res.status(400).json({ 
                error: 'Tutti i campi obbligatori devono essere compilati.' 
            });
        }

        // 3. Vérifier que le rôle est valide
        if (!['organizzatore', 'venditore'].includes(ruolo)) {
            return res.status(400).json({ 
                error: 'Ruolo non valido. Scegliere organizzatore o venditore.' 
            });
        }

        // 4. Vérifier si l'email existe déjà
        const [existingUser] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ 
                error: 'Email già registrata.' 
            });
        }

        // 5. Hasher le mot de passe avec bcrypt
        // Le "10" est le nombre de "salt rounds" (plus = plus sécurisé mais plus lent)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Insérer l'utilisateur dans la base de données
        const [result] = await pool.query(
            `INSERT INTO users (nome, email, password, ruolo, telefono, descrizione) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, email, hashedPassword, ruolo, telefono || null, descrizione || null]
        );

        // 7. Répondre avec succès (sans renvoyer le mot de passe)
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
        console.error('Erreur register:', error);
        res.status(500).json({ 
            error: 'Errore durante la registrazione.' 
        });
    }
};

// ============================================
// LOGIN - Connexion d'un utilisateur existant
// ============================================
// POST /api/auth/login
// Body: { email, password }

const login = async (req, res) => {
    try {
        // 1. Extraire email et password
        const { email, password } = req.body;

        // 2. Validation
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email e password sono obbligatori.' 
            });
        }

        // 3. Chercher l'utilisateur par email
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

        // 4. Comparer le mot de passe avec le hash stocké
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                error: 'Email o password non corretti.' 
            });
        }

        // 5. Créer le token JWT
        // Le token contient les infos utilisateur et expire en 24h
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

        // 6. Répondre avec le token et les infos utilisateur
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
        console.error('Erreur login:', error);
        res.status(500).json({ 
            error: 'Errore durante il login.' 
        });
    }
};

// ============================================
// GET PROFILE - Récupérer le profil de l'utilisateur connecté
// ============================================
// GET /api/auth/profile
// Nécessite: Token JWT valide

const getProfile = async (req, res) => {
    try {
        // req.user est ajouté par le middleware verifyToken
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
        console.error('Erreur getProfile:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero del profilo.' 
        });
    }
};

module.exports = { register, login, getProfile };

