// ============================================
// MIDDLEWARE D'AUTHENTIFICATION JWT
// ============================================
// Ce middleware vérifie que l'utilisateur est connecté
// Il extrait et valide le token JWT envoyé dans les headers

const jwt = require('jsonwebtoken');
require('dotenv').config();

// ============================================
// verifyToken - Vérifie si l'utilisateur est authentifié
// ============================================
// Utilisé sur les routes protégées
// Le token doit être envoyé dans le header: Authorization: Bearer <token>

const verifyToken = (req, res, next) => {
    try {
        // 1. Récupérer le header Authorization
        const authHeader = req.headers['authorization'];
        
        // 2. Vérifier que le header existe
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Accesso negato. Token mancante.' 
            });
        }

        // 3. Extraire le token (format: "Bearer <token>")
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Formato token non valido.' 
            });
        }

        // 4. Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. Ajouter les données utilisateur à la requête
        // Ces données seront accessibles dans les controllers
        req.user = decoded;
        
        // 6. Passer au middleware/controller suivant
        next();
        
    } catch (error) {
        // Token invalide ou expiré
        return res.status(401).json({ 
            error: 'Token non valido o scaduto.' 
        });
    }
};

// ============================================
// isOrganizzatore - Vérifie le rôle organizzatore
// ============================================
// Utilisé sur les routes réservées aux organizzatori
// Doit être appelé APRÈS verifyToken

const isOrganizzatore = (req, res, next) => {
    if (req.user.ruolo !== 'organizzatore') {
        return res.status(403).json({ 
            error: 'Accesso riservato agli organizzatori.' 
        });
    }
    next();
};

// ============================================
// isVenditore - Vérifie le rôle venditore
// ============================================
// Utilisé sur les routes réservées aux venditori

const isVenditore = (req, res, next) => {
    if (req.user.ruolo !== 'venditore') {
        return res.status(403).json({ 
            error: 'Accesso riservato ai venditori.' 
        });
    }
    next();
};

module.exports = { verifyToken, isOrganizzatore, isVenditore };

