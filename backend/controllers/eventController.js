// ============================================
// CONTROLLER DEGLI EVENTI
// ============================================
// Gestisce il CRUD (Create, Read, Update, Delete) degli eventi
// Gli eventi sono creati dagli organizzatori

const { pool } = require('../config/database');

// ============================================
// GET ALL EVENTS - Elenco di tutti gli eventi
// ============================================
// GET /api/eventi
// Accessibile a tutti (pubblico)
// Query params opzionali: citta, data

const getAllEvents = async (req, res) => {
    try {
        // Recuperare i filtri eventuali
        const { citta, data } = req.query;
        
        // Costruire la query SQL con filtri opzionali
        let query = `
            SELECT e.*, u.nome as organizzatore_nome 
            FROM eventi e 
            JOIN users u ON e.organizzatore_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // Filtro per città se fornito
        if (citta) {
            query += ' AND e.citta LIKE ?';
            params.push(`%${citta}%`);
        }

        // Filtro per data se fornito
        if (data) {
            query += ' AND e.data_evento = ?';
            params.push(data);
        }

        // Ordinare per data (eventi più vicini per primi)
        query += ' ORDER BY e.data_evento ASC';

        const [events] = await pool.query(query, params);

        // Parsare il campo requisiti (può essere JSON o testo semplice)
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
        console.error('Errore getAllEvents:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero degli eventi.' 
        });
    }
};

// ============================================
// GET EVENT BY ID - Dettaglio di un evento
// ============================================
// GET /api/eventi/:id
// Accessibile a tutti (pubblico)

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

        // Parsare i requisiti (può essere JSON o testo semplice)
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
        console.error('Errore getEventById:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero dell\'evento.' 
        });
    }
};

// ============================================
// CREATE EVENT - Creare un nuovo evento
// ============================================
// POST /api/eventi
// Riservato agli organizzatori (protetto da JWT)
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

        // L'ID dell'organizzatore proviene dal token JWT
        const organizzatore_id = req.user.id;

        // Validazione dei campi obbligatori
        if (!titolo || !descrizione || !data_evento || !citta || !indirizzo || !prezzo || !posti_totali) {
            return res.status(400).json({ 
                error: 'Tutti i campi obbligatori devono essere compilati.' 
            });
        }

        // Convertire i requisiti in stringa JSON per la memorizzazione
        const requisitiJson = requisiti ? JSON.stringify(requisiti) : null;

        // Inserire l'evento
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
        console.error('Errore createEvent:', error);
        res.status(500).json({ 
            error: 'Errore nella creazione dell\'evento.' 
        });
    }
};

// ============================================
// UPDATE EVENT - Modificare un evento
// ============================================
// PUT /api/eventi/:id
// Riservato al proprietario dell'evento

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const organizzatore_id = req.user.id;

        // Verificare che l'evento appartenga all'utente
        const [existingEvents] = await pool.query(
            'SELECT * FROM eventi WHERE id = ? AND organizzatore_id = ?',
            [id, organizzatore_id]
        );

        if (existingEvents.length === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato o non autorizzato.' 
            });
        }

        // Recuperare i nuovi dati
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

        // Convertire i requisiti in JSON
        const requisitiJson = requisiti ? JSON.stringify(requisiti) : null;

        // Aggiornare
        await pool.query(
            `UPDATE eventi SET 
             titolo = ?, descrizione = ?, data_evento = ?, citta = ?, indirizzo = ?, 
             prezzo = ?, posti_totali = ?, dimensione_stand = ?, requisiti = ?, immagine = ?
             WHERE id = ?`,
            [titolo, descrizione, data_evento, citta, indirizzo, prezzo, posti_totali, dimensione_stand, requisitiJson, immagine, id]
        );

        res.json({ message: 'Evento aggiornato con successo!' });

    } catch (error) {
        console.error('Errore updateEvent:', error);
        res.status(500).json({ 
            error: 'Errore nell\'aggiornamento dell\'evento.' 
        });
    }
};

// ============================================
// DELETE EVENT - Eliminare un evento
// ============================================
// DELETE /api/eventi/:id
// Riservato al proprietario dell'evento

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const organizzatore_id = req.user.id;

        // Verificare che l'evento appartenga all'utente
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
        console.error('Errore deleteEvent:', error);
        res.status(500).json({ 
            error: 'Errore nell\'eliminazione dell\'evento.' 
        });
    }
};

// ============================================
// GET MY EVENTS - Eventi dell'organizzatore connesso
// ============================================
// GET /api/eventi/miei
// Riservato agli organizzatori connessi

const getMyEvents = async (req, res) => {
    try {
        const organizzatore_id = req.user.id;

        // Recuperare gli eventi con il conteggio delle candidature
        const [events] = await pool.query(
            `SELECT e.*, 
                    (SELECT COUNT(*) FROM candidature WHERE evento_id = e.id) as num_candidature,
                    (SELECT COUNT(*) FROM candidature WHERE evento_id = e.id AND stato = 'approvata') as posti_occupati
             FROM eventi e 
             WHERE e.organizzatore_id = ?
             ORDER BY e.data_evento ASC`,
            [organizzatore_id]
        );

        // Parsare i requisiti (può essere JSON o testo semplice)
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
        console.error('Errore getMyEvents:', error);
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

