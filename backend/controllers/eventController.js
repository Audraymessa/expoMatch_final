// ============================================
// CONTROLLER DES ÉVÉNEMENTS
// ============================================
// Gère le CRUD (Create, Read, Update, Delete) des événements
// Les événements sont créés par les organizzatori

const { pool } = require('../config/database');

// ============================================
// GET ALL EVENTS - Liste tous les événements
// ============================================
// GET /api/eventi
// Accessible à tous (public)
// Query params optionnels: citta, data

const getAllEvents = async (req, res) => {
    try {
        // Récupérer les filtres éventuels
        const { citta, data } = req.query;
        
        // Construire la requête SQL avec filtres optionnels
        let query = `
            SELECT e.*, u.nome as organizzatore_nome 
            FROM eventi e 
            JOIN users u ON e.organizzatore_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // Filtre par ville si fourni
        if (citta) {
            query += ' AND e.citta LIKE ?';
            params.push(`%${citta}%`);
        }

        // Filtre par date si fourni
        if (data) {
            query += ' AND e.data_evento = ?';
            params.push(data);
        }

        // Trier par date (événements les plus proches en premier)
        query += ' ORDER BY e.data_evento ASC';

        const [events] = await pool.query(query, params);

        // Parser le champ requisiti (peut être JSON ou texte simple)
        const eventsWithRequisiti = events.map(event => {
            let requisiti = [];
            if (event.requisiti) {
                try {
                    // Essayer de parser comme JSON
                    requisiti = JSON.parse(event.requisiti);
                } catch (e) {
                    // Si ce n'est pas du JSON, convertir en tableau
                    requisiti = event.requisiti.split(',').map(r => r.trim());
                }
            }
            return { ...event, requisiti };
        });

        res.json(eventsWithRequisiti);

    } catch (error) {
        console.error('Erreur getAllEvents:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero degli eventi.' 
        });
    }
};

// ============================================
// GET EVENT BY ID - Détail d'un événement
// ============================================
// GET /api/eventi/:id
// Accessible à tous (public)

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const [events] = await pool.query(
            `SELECT e.*, u.nome as organizzatore_nome, u.email as organizzatore_email
             FROM eventi e 
             JOIN users u ON e.organizzatore_id = u.id
             WHERE e.id = ?`,
            [id]
        );

        if (events.length === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato.' 
            });
        }

        // Parser les requisiti (peut être JSON ou texte simple)
        let requisiti = [];
        if (events[0].requisiti) {
            try {
                requisiti = JSON.parse(events[0].requisiti);
            } catch (e) {
                requisiti = events[0].requisiti.split(',').map(r => r.trim());
            }
        }
        const event = { ...events[0], requisiti };

        res.json(event);

    } catch (error) {
        console.error('Erreur getEventById:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero dell\'evento.' 
        });
    }
};

// ============================================
// CREATE EVENT - Créer un nouvel événement
// ============================================
// POST /api/eventi
// Réservé aux organizzatori (protégé par JWT)
// Body: { titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, dimensione_stand, requisiti, immagine }

const createEvent = async (req, res) => {
    try {
        const { 
            titolo, 
            descrizione, 
            data_evento, 
            citta, 
            indirizzo, 
            prezzo, 
            posti_totali, 
            dimensione_stand, 
            requisiti,
            immagine 
        } = req.body;

        // L'ID de l'organizzatore vient du token JWT
        const organizzatore_id = req.user.id;

        // Validation des champs obligatoires
        if (!titolo || !descrizione || !data_evento || !citta || !indirizzo || !prezzo || !posti_totali) {
            return res.status(400).json({ 
                error: 'Tutti i campi obbligatori devono essere compilati.' 
            });
        }

        // Convertir les requisiti en JSON string pour stockage
        const requisitiJson = requisiti ? JSON.stringify(requisiti) : null;

        // Insérer l'événement
        const [result] = await pool.query(
            `INSERT INTO eventi 
             (titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, posti_disponibili, dimensione_stand, requisiti, immagine, organizzatore_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, posti_totali, dimensione_stand || null, requisitiJson, immagine || null, organizzatore_id]
        );

        res.status(201).json({
            message: 'Evento creato con successo!',
            evento: {
                id: result.insertId,
                titolo,
                data_evento,
                citta
            }
        });

    } catch (error) {
        console.error('Erreur createEvent:', error);
        res.status(500).json({ 
            error: 'Errore nella creazione dell\'evento.' 
        });
    }
};

// ============================================
// UPDATE EVENT - Modifier un événement
// ============================================
// PUT /api/eventi/:id
// Réservé au propriétaire de l'événement

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const organizzatore_id = req.user.id;

        // Vérifier que l'événement appartient à l'utilisateur
        const [existingEvents] = await pool.query(
            'SELECT * FROM eventi WHERE id = ? AND organizzatore_id = ?',
            [id, organizzatore_id]
        );

        if (existingEvents.length === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato o non autorizzato.' 
            });
        }

        // Récupérer les nouvelles données
        const { 
            titolo, 
            descrizione, 
            data_evento, 
            citta, 
            indirizzo, 
            prezzo, 
            posti_totali, 
            dimensione_stand, 
            requisiti,
            immagine 
        } = req.body;

        // Convertir requisiti en JSON
        const requisitiJson = requisiti ? JSON.stringify(requisiti) : null;

        // Mettre à jour
        await pool.query(
            `UPDATE eventi SET 
             titolo = ?, descrizione = ?, data_evento = ?, citta = ?, indirizzo = ?, 
             prezzo = ?, posti_totali = ?, dimensione_stand = ?, requisiti = ?, immagine = ?
             WHERE id = ?`,
            [titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, dimensione_stand, requisitiJson, immagine, id]
        );

        res.json({ message: 'Evento aggiornato con successo!' });

    } catch (error) {
        console.error('Erreur updateEvent:', error);
        res.status(500).json({ 
            error: 'Errore nell\'aggiornamento dell\'evento.' 
        });
    }
};

// ============================================
// DELETE EVENT - Supprimer un événement
// ============================================
// DELETE /api/eventi/:id
// Réservé au propriétaire de l'événement

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const organizzatore_id = req.user.id;

        // Vérifier que l'événement appartient à l'utilisateur
        const [result] = await pool.query(
            'DELETE FROM eventi WHERE id = ? AND organizzatore_id = ?',
            [id, organizzatore_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato o non autorizzato.' 
            });
        }

        res.json({ message: 'Evento eliminato con successo!' });

    } catch (error) {
        console.error('Erreur deleteEvent:', error);
        res.status(500).json({ 
            error: 'Errore nell\'eliminazione dell\'evento.' 
        });
    }
};

// ============================================
// GET MY EVENTS - Événements de l'organizzatore connecté
// ============================================
// GET /api/eventi/miei
// Réservé aux organizzatori connectés

const getMyEvents = async (req, res) => {
    try {
        const organizzatore_id = req.user.id;

        // Récupérer les événements avec le compte des candidatures
        const [events] = await pool.query(
            `SELECT e.*, 
                    (SELECT COUNT(*) FROM candidature WHERE evento_id = e.id) as num_candidature,
                    (SELECT COUNT(*) FROM candidature WHERE evento_id = e.id AND stato = 'approvata') as posti_occupati
             FROM eventi e 
             WHERE e.organizzatore_id = ?
             ORDER BY e.data_evento ASC`,
            [organizzatore_id]
        );

        // Parser les requisiti (peut être JSON ou texte simple)
        const eventsWithRequisiti = events.map(event => {
            let requisiti = [];
            if (event.requisiti) {
                try {
                    requisiti = JSON.parse(event.requisiti);
                } catch (e) {
                    requisiti = event.requisiti.split(',').map(r => r.trim());
                }
            }
            return { ...event, requisiti };
        });

        res.json(eventsWithRequisiti);

    } catch (error) {
        console.error('Erreur getMyEvents:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero dei tuoi eventi.' 
        });
    }
};

module.exports = { 
    getAllEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    getMyEvents 
};

