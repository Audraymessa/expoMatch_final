// ============================================
// ROUTE DI AUTENTICAZIONE
// ============================================
// Definisce gli endpoint per la registrazione e l'accesso
// Prefisso: /api/auth

const express = require('express');
const router = express.Router();

// Importare il controller e il middleware
const { register, login, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// ============================================
// ROUTE PUBBLICHE (senza autenticazione)
// ============================================

// POST /api/auth/register - Registrazione
// Body atteso: { nome, email, password, ruolo, telefono?, descrizione? }
router.post('/register', register);

// POST /api/auth/login - Accesso
// Body atteso: { email, password }
// Restituisce: { token, user }
router.post('/login', login);

// ============================================
// ROUTE PROTETTE (richiedono un token JWT)
// ============================================

// GET /api/auth/profile - Recuperare il proprio profilo
// Header richiesto: Authorization: Bearer <token>
router.get('/profile', verifyToken, getProfile);

module.exports = router;

