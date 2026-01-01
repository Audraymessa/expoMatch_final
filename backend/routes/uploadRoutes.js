// ============================================
// ROUTES D'UPLOAD D'IMAGES
// ============================================
// Gère le téléchargement d'images depuis l'appareil

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ============================================
// CONFIGURATION DE MULTER
// ============================================
// Définit où et comment stocker les fichiers uploadés

const storage = multer.diskStorage({
    // Dossier de destination
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Nom du fichier (timestamp + nom original)
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtre pour n'accepter que les images
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
// POST /api/upload - Upload d'une image
// ============================================

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nessun file caricato.' });
        }

        // Retourner l'URL de l'image uploadée
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        
        res.json({
            message: 'Immagine caricata con successo!',
            imageUrl: imageUrl,
            filename: req.file.filename
        });

    } catch (error) {
        console.error('Erreur upload:', error);
        res.status(500).json({ error: 'Errore nel caricamento dell\'immagine.' });
    }
});

module.exports = router;

