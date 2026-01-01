// ============================================
// CONTROLLER DES CANDIDATURES
// ============================================
// Gère les candidatures des venditori aux eventi
// Permet aux organizzatori d'approuver/refuser les demandes

const { pool } = require('../config/database');

// ============================================
// CREATE CANDIDATURA - Postuler à un événement
// ============================================
// POST /api/candidature
// Réservé aux venditori
// Body: { evento_id, messaggio (optionnel) }

const createCandidatura = async (req, res) => {
    try {
        const { evento_id, messaggio } = req.body;
        const venditore_id = req.user.id;

        // Vérifier que l'événement existe et a des places disponibles
        const [events] = await pool.query(
            'SELECT * FROM eventi WHERE id = ? AND posti_disponibili > 0',
            [evento_id]
        );

        if (events.length === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato o posti esauriti.' 
            });
        }

        // Vérifier que le venditore n'a pas déjà postulé
        const [existing] = await pool.query(
            'SELECT * FROM candidature WHERE evento_id = ? AND venditore_id = ?',
            [evento_id, venditore_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({ 
                error: 'Hai già inviato una candidatura per questo evento.' 
            });
        }

        // Créer la candidature
        const [result] = await pool.query(
            'INSERT INTO candidature (evento_id, venditore_id, messaggio) VALUES (?, ?, ?)',
            [evento_id, venditore_id, messaggio || null]
        );

        res.status(201).json({
            message: 'Candidatura inviata con successo!',
            candidatura: {
                id: result.insertId,
                evento_id,
                stato: 'in_attesa'
            }
        });

    } catch (error) {
        console.error('Erreur createCandidatura:', error);
        res.status(500).json({ 
            error: 'Errore nell\'invio della candidatura.' 
        });
    }
};

// ============================================
// GET MY CANDIDATURE - Candidatures du venditore connecté
// ============================================
// GET /api/candidature/mie
// Réservé aux venditori

const getMyCandidature = async (req, res) => {
    try {
        const venditore_id = req.user.id;

        const [candidature] = await pool.query(
            `SELECT c.*, e.titolo, e.data_evento, e.citta, e.immagine, e.prezzo
             FROM candidature c
             JOIN eventi e ON c.evento_id = e.id
             WHERE c.venditore_id = ?
             ORDER BY c.created_at DESC`,
            [venditore_id]
        );

        res.json(candidature);

    } catch (error) {
        console.error('Erreur getMyCandidature:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero delle candidature.' 
        });
    }
};

// ============================================
// GET EVENT CANDIDATURE - Candidatures d'un événement
// ============================================
// GET /api/candidature/evento/:evento_id
// Réservé à l'organizzatore propriétaire de l'événement

const getEventCandidature = async (req, res) => {
    try {
        const { evento_id } = req.params;
        const organizzatore_id = req.user.id;

        // Vérifier que l'événement appartient à l'organizzatore
        const [events] = await pool.query(
            'SELECT * FROM eventi WHERE id = ? AND organizzatore_id = ?',
            [evento_id, organizzatore_id]
        );

        if (events.length === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato o non autorizzato.' 
            });
        }

        // Récupérer les candidatures avec les infos des venditori
        const [candidature] = await pool.query(
            `SELECT c.*, u.nome as venditore_nome, u.email as venditore_email, 
                    u.telefono as venditore_telefono, u.descrizione as venditore_descrizione
             FROM candidature c
             JOIN users u ON c.venditore_id = u.id
             WHERE c.evento_id = ?
             ORDER BY c.created_at DESC`,
            [evento_id]
        );

        res.json(candidature);

    } catch (error) {
        console.error('Erreur getEventCandidature:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero delle candidature.' 
        });
    }
};

// ============================================
// UPDATE CANDIDATURA STATUS - Approuver/Refuser
// ============================================
// PUT /api/candidature/:id
// Réservé à l'organizzatore propriétaire de l'événement
// Body: { stato: 'approvata' | 'rifiutata' }

const updateCandidaturaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { stato } = req.body;
        const organizzatore_id = req.user.id;

        // Vérifier que le stato est valide
        if (!['approvata', 'rifiutata'].includes(stato)) {
            return res.status(400).json({ 
                error: 'Stato non valido. Usare approvata o rifiutata.' 
            });
        }

        // Récupérer la candidature et vérifier les droits
        const [candidature] = await pool.query(
            `SELECT c.*, e.organizzatore_id, e.posti_disponibili
             FROM candidature c
             JOIN eventi e ON c.evento_id = e.id
             WHERE c.id = ?`,
            [id]
        );

        if (candidature.length === 0) {
            return res.status(404).json({ 
                error: 'Candidatura non trovata.' 
            });
        }

        if (candidature[0].organizzatore_id !== organizzatore_id) {
            return res.status(403).json({ 
                error: 'Non autorizzato.' 
            });
        }

        // Si on approuve, vérifier qu'il y a des places et les décrémenter
        if (stato === 'approvata') {
            if (candidature[0].posti_disponibili <= 0) {
                return res.status(400).json({ 
                    error: 'Nessun posto disponibile.' 
                });
            }

            // Décrémenter les places disponibles
            await pool.query(
                'UPDATE eventi SET posti_disponibili = posti_disponibili - 1 WHERE id = ?',
                [candidature[0].evento_id]
            );
        }

        // Si on refuse une candidature précédemment approuvée, réincrémenter
        if (stato === 'rifiutata' && candidature[0].stato === 'approvata') {
            await pool.query(
                'UPDATE eventi SET posti_disponibili = posti_disponibili + 1 WHERE id = ?',
                [candidature[0].evento_id]
            );
        }

        // Mettre à jour le statut
        await pool.query(
            'UPDATE candidature SET stato = ? WHERE id = ?',
            [stato, id]
        );

        res.json({ 
            message: `Candidatura ${stato === 'approvata' ? 'approvata' : 'rifiutata'} con successo!` 
        });

    } catch (error) {
        console.error('Erreur updateCandidaturaStatus:', error);
        res.status(500).json({ 
            error: 'Errore nell\'aggiornamento della candidatura.' 
        });
    }
};

// ============================================
// DELETE CANDIDATURA - Retirer sa candidature
// ============================================
// DELETE /api/candidature/:id
// Réservé au venditore propriétaire de la candidature

const deleteCandidatura = async (req, res) => {
    try {
        const { id } = req.params;
        const venditore_id = req.user.id;

        // Vérifier et récupérer la candidature
        const [candidature] = await pool.query(
            'SELECT * FROM candidature WHERE id = ? AND venditore_id = ?',
            [id, venditore_id]
        );

        if (candidature.length === 0) {
            return res.status(404).json({ 
                error: 'Candidatura non trovata o non autorizzata.' 
            });
        }

        // Si la candidature était approuvée, réincrémenter les places
        if (candidature[0].stato === 'approvata') {
            await pool.query(
                'UPDATE eventi SET posti_disponibili = posti_disponibili + 1 WHERE id = ?',
                [candidature[0].evento_id]
            );
        }

        // Supprimer la candidature
        await pool.query('DELETE FROM candidature WHERE id = ?', [id]);

        res.json({ message: 'Candidatura ritirata con successo!' });

    } catch (error) {
        console.error('Erreur deleteCandidatura:', error);
        res.status(500).json({ 
            error: 'Errore nell\'eliminazione della candidatura.' 
        });
    }
};

module.exports = { 
    createCandidatura, 
    getMyCandidature, 
    getEventCandidature, 
    updateCandidaturaStatus, 
    deleteCandidatura 
};

