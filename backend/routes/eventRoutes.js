// ============================================
// ROUTES DES ÉVÉNEMENTS
// ============================================
// Définit les endpoints CRUD pour les eventi
// Préfixe: /api/eventi

const express = require('express');
const router = express.Router();

// Importer le controller et les middlewares
const { 
    getAllEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    getMyEvents 
} = require('../controllers/eventController');

const { verifyToken, isOrganizzatore } = require('../middleware/authMiddleware');

// ============================================
// ROUTES PUBLIQUES (accessibles à tous)
// ============================================

// GET /api/eventi - Liste tous les événements
// Query params optionnels: ?citta=Milano&data=2025-12-15
router.get('/', getAllEvents);

// GET /api/eventi/:id - Détail d'un événement spécifique
router.get('/:id', getEventById);

// ============================================
// ROUTES PROTÉGÉES - ORGANIZZATORI UNIQUEMENT
// ============================================
// Ces routes nécessitent:
// 1. Un token JWT valide (verifyToken)
// 2. Le rôle "organizzatore" (isOrganizzatore)

// GET /api/eventi/miei/lista - Mes événements (organizzatore)
// Note: Cette route doit être avant /:id pour éviter conflit
router.get('/miei/lista', verifyToken, isOrganizzatore, getMyEvents);

// POST /api/eventi - Créer un nouvel événement
// Body attendu: { titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, ... }
router.post('/', verifyToken, isOrganizzatore, createEvent);

// PUT /api/eventi/:id - Modifier un événement existant
// Seul le propriétaire peut modifier son événement
router.put('/:id', verifyToken, isOrganizzatore, updateEvent);

// DELETE /api/eventi/:id - Supprimer un événement
// Seul le propriétaire peut supprimer son événement
router.delete('/:id', verifyToken, isOrganizzatore, deleteEvent);

module.exports = router;

