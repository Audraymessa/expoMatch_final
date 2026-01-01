// ============================================
// ROUTES D'AUTHENTIFICATION
// ============================================
// Définit les endpoints pour l'inscription et la connexion
// Préfixe: /api/auth

const express = require('express');
const router = express.Router();

// Importer le controller et le middleware
const { register, login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// ============================================
// ROUTES PUBLIQUES (sans authentification)
// ============================================

// POST /api/auth/register - Inscription
// Body attendu: { nome, email, password, ruolo, telefono?, descrizione? }
router.post('/register', register);

// POST /api/auth/login - Connexion
// Body attendu: { email, password }
// Retourne: { token, user }
router.post('/login', login);

// ============================================
// ROUTES PROTÉGÉES (nécessitent un token JWT)
// ============================================

// GET /api/auth/profile - Récupérer son profil
// Header requis: Authorization: Bearer <token>
router.get('/profile', verifyToken, getProfile);

module.exports = router;

