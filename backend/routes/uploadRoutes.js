// ============================================
// ROUTE DI UPLOAD IMMAGINI
// ============================================
// Gestisce il caricamento di immagini dal dispositivo

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ============================================
// CONFIGURAZIONE DI MULTER
// ============================================
// Definisce dove e come memorizzare i file caricati

const storage = multer.diskStorage({
    // Cartella di destinazione
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Nome del file (timestamp + nome originale)
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro per accettare solo le immagini
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo di file non supportato. Usa JPG, PNG, GIF o WEBP.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Max 5MB
    }
});

// ============================================
// POST /api/upload - Caricamento di un'immagine
// ============================================

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nessun file caricato.' });
        }

        // Restituire l'URL dell'immagine caricata
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        
        res.json({
            message: 'Immagine caricata con successo!',
            imageUrl: imageUrl,
            filename: req.file.filename
        });

    } catch (error) {
        console.error('Errore upload:', error);
        res.status(500).json({ error: 'Errore nel caricamento dell\'immagine.' });
    }
});

module.exports = router;

