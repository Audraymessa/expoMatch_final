// ============================================
// ROUTE DELLE CANDIDATURE
// ============================================
// Definisce gli endpoint per gestire le candidature
// Prefisso: /api/candidature

const express = require('express');
const router = express.Router();

// Importare il controller e i middleware
const { 
    createCandidatura, 
    getMyCandidature, 
    getEventCandidature, 
    updateCandidaturaStatus, 
    deleteCandidatura 
} = require('../controllers/candidaturaController');

const { verifyToken, isOrganizzatore, isVenditore } = require('../middleware/authMiddleware');

// ============================================
// ROUTE PER I VENDITORI
// ============================================

// POST /api/candidature - Candidarsi a un evento
// Body atteso: { evento_id, messaggio? }
// Riservato ai venditori
router.post('/', verifyToken, isVenditore, createCandidatura);

// GET /api/candidature/mie - Vedere le mie candidature
// Riservato ai venditori
router.get('/mie', verifyToken, isVenditore, getMyCandidature);

// DELETE /api/candidature/:id - Ritirare la mia candidatura
// Riservato ai venditori (proprietario della candidatura)
router.delete('/:id', verifyToken, isVenditore, deleteCandidatura);

// ============================================
// ROUTE PER GLI ORGANIZZATORI
// ============================================

// GET /api/candidature/evento/:evento_id - Candidature di un evento
// Riservato all'organizzatore proprietario dell'evento
router.get('/evento/:evento_id', verifyToken, isOrganizzatore, getEventCandidature);

// PUT /api/candidature/:id - Approvare/Rifiutare una candidatura
// Body atteso: { stato: 'approvata' | 'rifiutata' }
// Riservato all'organizzatore proprietario dell'evento
router.put('/:id', verifyToken, isOrganizzatore, updateCandidaturaStatus);

module.exports = router;

