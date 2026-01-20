// ============================================
// CONTROLLER DELLE CANDIDATURE

// Gestisce le candidature dei venditori agli eventi
// Permette agli organizzatori di approvare/rifiutare le richieste

const { pool } = require('../config/database');

// ============================================
// CREATE CANDIDATURA - Candidarsi a un evento
// ============================================
// POST /api/candidature
// Riservato ai venditori
// Body: { evento_id, messaggio (opzionale) }

const createCandidatura = async (req, res) => {
    try {
        const { evento_id, messaggio } = req.body;
        const venditore_id = req.user.id;

        // Verificare che l'evento esista e abbia posti disponibili
        const [events] = await pool.query(
            'SELECT * FROM eventi WHERE id = ? AND posti_disponibili > 0',
            [evento_id]
        );

        if (events.length === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato o posti esauriti.' 
            });
        }

        // Verificare che il venditore non abbia già inviato una candidatura
        const [existing] = await pool.query(
            'SELECT * FROM candidature WHERE evento_id = ? AND venditore_id = ?',
            [evento_id, venditore_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({ 
                error: 'Hai già inviato una candidatura per questo evento.' 
            });
        }

        // Creare la candidatura
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
        console.error('Errore createCandidatura:', error);
        res.status(500).json({ 
            error: 'Errore nell\'invio della candidatura.' 
        });
    }
};

// ============================================
// GET MY CANDIDATURE - Candidature del venditore connesso
// ============================================
// GET /api/candidature/mie
// Riservato ai venditori

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
        console.error('Errore getMyCandidature:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero delle candidature.' 
        });
    }
};

// ============================================
// GET EVENT CANDIDATURE - Candidature di un evento
// ============================================
// GET /api/candidature/evento/:evento_id
// Riservato all'organizzatore proprietario dell'evento

const getEventCandidature = async (req, res) => {
    try {
        const { evento_id } = req.params;
        const organizzatore_id = req.user.id;

        // Verificare che l'evento appartenga all'organizzatore
        const [events] = await pool.query(
            'SELECT * FROM eventi WHERE id = ? AND organizzatore_id = ?',
            [evento_id, organizzatore_id]
        );

        if (events.length === 0) {
            return res.status(404).json({ 
                error: 'Evento non trovato o non autorizzato.' 
            });
        }

        // Recuperare le candidature con le informazioni dei venditori
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
        console.error('Errore getEventCandidature:', error);
        res.status(500).json({ 
            error: 'Errore nel recupero delle candidature.' 
        });
    }
};

// ============================================
// UPDATE CANDIDATURA STATUS - Approvare/Rifiutare
// ============================================
// PUT /api/candidature/:id
// Riservato all'organizzatore proprietario dell'evento
// Body: { stato: 'approvata' | 'rifiutata' }

const updateCandidaturaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { stato } = req.body;
        const organizzatore_id = req.user.id;

        // Verificare che lo stato sia valido
        if (!['approvata', 'rifiutata'].includes(stato)) {
            return res.status(400).json({ 
                error: 'Stato non valido. Usare approvata o rifiutata.' 
            });
        }

        // Recuperare la candidatura e verificare i diritti
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

        // Se si approva, verificare che ci siano posti e decrementarli
        if (stato === 'approvata') {
            if (candidature[0].posti_disponibili <= 0) {
                return res.status(400).json({ 
                    error: 'Nessun posto disponibile.' 
                });
            }

            // Decrementare i posti disponibili
            await pool.query(
                'UPDATE eventi SET posti_disponibili = posti_disponibili - 1 WHERE id = ?',
                [candidature[0].evento_id]
            );
        }

        // Se si rifiuta una candidatura precedentemente approvata, reincrementare
        if (stato === 'rifiutata' && candidature[0].stato === 'approvata') {
            await pool.query(
                'UPDATE eventi SET posti_disponibili = posti_disponibili + 1 WHERE id = ?',
                [candidature[0].evento_id]
            );
        }

        // Aggiornare lo stato
        await pool.query(
            'UPDATE candidature SET stato = ? WHERE id = ?',
            [stato, id]
        );

        res.json({ 
            message: `Candidatura ${stato === 'approvata' ? 'approvata' : 'rifiutata'} con successo!` 
        });

    } catch (error) {
        console.error('Errore updateCandidaturaStatus:', error);
        res.status(500).json({ 
            error: 'Errore nell\'aggiornamento della candidatura.' 
        });
    }
};

// ============================================
// DELETE CANDIDATURA - Ritirare la propria candidatura
// ============================================
// DELETE /api/candidature/:id
// Riservato al venditore proprietario della candidatura

const deleteCandidatura = async (req, res) => {
    try {
        const { id } = req.params;
        const venditore_id = req.user.id;

        // Verificare e recuperare la candidatura
        const [candidature] = await pool.query(
            'SELECT * FROM candidature WHERE id = ? AND venditore_id = ?',
            [id, venditore_id]
        );

        if (candidature.length === 0) {
            return res.status(404).json({ 
                error: 'Candidatura non trovata o non autorizzata.' 
            });
        }

        // Se la candidatura era approvata, reincrementare i posti
        if (candidature[0].stato === 'approvata') {
            await pool.query(
                'UPDATE eventi SET posti_disponibili = posti_disponibili + 1 WHERE id = ?',
                [candidature[0].evento_id]
            );
        }

        // Eliminare la candidatura
        await pool.query('DELETE FROM candidature WHERE id = ?', [id]);

        res.json({ message: 'Candidatura ritirata con successo!' });

    } catch (error) {
        console.error('Errore deleteCandidatura:', error);
        res.status(500).json({ 
            error: 'Errore nell\'eliminazione della candidatura.' 
        });
    }
};
// ============================================
//  Verifica stato candidatura
// ============================================
// nuova funziona per verificare se un venditore ha già candidato a un evento

const checkCandidatura = async (req, res) => {
    try {
        const { evento_id } = req.params;
        const venditore_id = req.user.id; // Preso dal token

        // Cerca se esiste una candidatura per questo evento e questo utente
        const [candidature] = await pool.query(
            'SELECT stato FROM candidature WHERE evento_id = ? AND venditore_id = ?',
            [evento_id, venditore_id]
        );

        if (candidature.length > 0) {
            // Trovata! Restituisci true e lo stato (es. 'in_attesa' o 'approvata')
            return res.json({ 
                candidato: true, 
                stato: candidature[0].stato 
            });
        }

        // Non trovata
        res.json({ 
            candidato: false, 
            stato: null 
        });

    } catch (error) {
        console.error('Errore checkCandidatura:', error);
        res.status(500).json({ error: 'Errore nel controllo della candidatura.' });
    }
};

module.exports = { 
    createCandidatura, 
    getMyCandidature, 
    getEventCandidature, 
    updateCandidaturaStatus, 
    deleteCandidatura ,
    checkCandidatura
};

