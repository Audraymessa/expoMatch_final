// ============================================
// ROUTE DEGLI EVENTI
// ============================================
// Definisce gli endpoint CRUD per gli eventi
// Prefisso: /api/eventi

const express = require('express');
const router = express.Router();

// Importare il controller e i middleware
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
// ROUTE PUBBLICHE (accessibili a tutti)
// ============================================

// GET /api/eventi - Elenco di tutti gli eventi
// Query params opzionali: ?citta=Milano&data=2025-12-15
router.get('/', getAllEvents);

// GET /api/eventi/:id - Dettaglio di un evento specifico
router.get('/:id', getEventById);

// ============================================
// ROUTE PROTETTE - SOLO ORGANIZZATORI
// ============================================
// Queste route richiedono:
// 1. Un token JWT valido (verifyToken)
// 2. Il ruolo "organizzatore" (isOrganizzatore)

// GET /api/eventi/miei/lista - I miei eventi (organizzatore)
// Nota: Questa route deve essere prima di /:id per evitare conflitti
router.get('/miei/lista', verifyToken, isOrganizzatore, getMyEvents);

// POST /api/eventi - Creare un nuovo evento
// Body atteso: { titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, ... }
router.post('/', verifyToken, isOrganizzatore, createEvent);

// PUT /api/eventi/:id - Modificare un evento esistente
// Solo il proprietario può modificare il suo evento
router.put('/:id', verifyToken, isOrganizzatore, updateEvent);

// DELETE /api/eventi/:id - Eliminare un evento
// Solo il proprietario può eliminare il suo evento
router.delete('/:id', verifyToken, isOrganizzatore, deleteEvent);

module.exports = router;

