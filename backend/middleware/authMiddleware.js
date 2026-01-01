// ============================================
// MIDDLEWARE DI AUTENTICAZIONE JWT
// ============================================
// Questo middleware verifica che l'utente sia connesso
// Estrae e valida il token JWT inviato negli header

const jwt = require('jsonwebtoken');
require('dotenv').config();

// ============================================
// verifyToken - Verifica se l'utente è autenticato
// ============================================
// Utilizzato sulle route protette
// Il token deve essere inviato nell'header: Authorization: Bearer <token>

const verifyToken = (req, res, next) => {
    try {
        // 1. Recuperare l'header Authorization
        const authHeader = req.headers['authorization'];
        
        // 2. Verificare che l'header esista
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Accesso negato. Token mancante.' 
            });
        }

        // 3. Estrarre il token (formato: "Bearer <token>")
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Formato token non valido.' 
            });
        }

        // 4. Verificare e decodificare il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. Aggiungere i dati utente alla richiesta
        // Questi dati saranno accessibili nei controller
        req.user = decoded;
        
        // 6. Passare al middleware/controller successivo
        next();
        
    } catch (error) {
        // Token invalido o scaduto
        return res.status(401).json({ 
            error: 'Token non valido o scaduto.' 
        });
    }
};

// ============================================
// isOrganizzatore - Verifica il ruolo organizzatore
// ============================================
// Utilizzato sulle route riservate agli organizzatori
// Deve essere chiamato DOPO verifyToken

const isOrganizzatore = (req, res, next) => {
    if (req.user.ruolo !== 'organizzatore') {
        return res.status(403).json({ 
            error: 'Accesso riservato agli organizzatori.' 
        });
    }
    next();
};

// ============================================
// isVenditore - Verifica il ruolo venditore
// ============================================
// Utilizzato sulle route riservate ai venditori

const isVenditore = (req, res, next) => {
    if (req.user.ruolo !== 'venditore') {
        return res.status(403).json({ 
            error: 'Accesso riservato ai venditori.' 
        });
    }
    next();
};

module.exports = { verifyToken, isOrganizzatore, isVenditore };

