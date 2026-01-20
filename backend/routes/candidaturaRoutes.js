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
    deleteCandidatura,
    checkCandidatura 
} = require('../controllers/candidaturaController');

const { verifyToken, isOrganizzatore, isVenditore } = require('../middleware/authMiddleware');

// ============================================
// ROUTE PER I VENDITORI
// ============================================

// POST /api/candidature - Candidarsi a un evento
router.post('/', verifyToken, isVenditore, createCandidatura);

// GET /api/candidature/mie - Vedere le mie candidature
router.get('/mie', verifyToken, isVenditore, getMyCandidature);

// =========================================================
// GET /api/candidature/check/:evento_id - Controllare se sono già candidato
router.get('/check/:evento_id', verifyToken, isVenditore, checkCandidatura);
// =========================================================

// DELETE /api/candidature/:id - Ritirare la mia candidatura
router.delete('/:id', verifyToken, isVenditore, deleteCandidatura);

// ============================================
// ROUTE PER GLI ORGANIZZATORI
// ============================================

// GET /api/candidature/evento/:evento_id - Candidature di un evento
router.get('/evento/:evento_id', verifyToken, isOrganizzatore, getEventCandidature);

// PUT /api/candidature/:id - Approvare/Rifiutare una candidatura
router.put('/:id', verifyToken, isOrganizzatore, updateCandidaturaStatus);

module.exports = router;