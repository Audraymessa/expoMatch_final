// ============================================
// ROUTES DES CANDIDATURES
// ============================================
// Définit les endpoints pour gérer les candidatures
// Préfixe: /api/candidature

const express = require('express');
const router = express.Router();

// Importer le controller et les middlewares
const { 
    createCandidatura, 
    getMyCandidature, 
    getEventCandidature, 
    updateCandidaturaStatus, 
    deleteCandidatura 
} = require('../controllers/candidaturaController');

const { verifyToken, isOrganizzatore, isVenditore } = require('../middleware/authMiddleware');

// ============================================
// ROUTES POUR LES VENDITORI
// ============================================

// POST /api/candidature - Postuler à un événement
// Body attendu: { evento_id, messaggio? }
// Réservé aux venditori
router.post('/', verifyToken, isVenditore, createCandidatura);

// GET /api/candidature/mie - Voir mes candidatures
// Réservé aux venditori
router.get('/mie', verifyToken, isVenditore, getMyCandidature);

// DELETE /api/candidature/:id - Retirer ma candidature
// Réservé aux venditori (propriétaire de la candidature)
router.delete('/:id', verifyToken, isVenditore, deleteCandidatura);

// ============================================
// ROUTES POUR LES ORGANIZZATORI
// ============================================

// GET /api/candidature/evento/:evento_id - Candidatures d'un événement
// Réservé à l'organizzatore propriétaire de l'événement
router.get('/evento/:evento_id', verifyToken, isOrganizzatore, getEventCandidature);

// PUT /api/candidature/:id - Approuver/Refuser une candidature
// Body attendu: { stato: 'approvata' | 'rifiutata' }
// Réservé à l'organizzatore propriétaire de l'événement
router.put('/:id', verifyToken, isOrganizzatore, updateCandidaturaStatus);

module.exports = router;

