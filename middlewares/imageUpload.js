// Middleware pour gérer le téléchargement d'images et la conversion en Base64
// Ce middleware utilise Multer pour gérer le téléchargement d'images et les convertit en Base64 pour un stockage temporaire dans la base de données.
// Il est configuré pour accepter uniquement les fichiers image et limite la taille à 5 Mo.

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuration du stockage temporaire
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filtre pour accepter uniquement les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Le fichier doit être une image'), false);
  }
};

// Configuration de Multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite à 5MB
});

// Middleware pour convertir l'image en Base64
const convertToBase64 = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  
  // Lire le fichier et le convertir en Base64
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return next(err);
    }
    
    // Conversion en Base64 avec le préfixe data URI
    const base64Image = `data:${req.file.mimetype};base64,${Buffer.from(data).toString('base64')}`;
    
    // Ajouter l'image Base64 à l'objet request
    req.body.image = base64Image;
    
    // Supprimer le fichier temporaire
    fs.unlink(filePath, (err) => {
      if (err) console.error('Erreur lors de la suppression du fichier temporaire:', err);
    });
    
    next();
  });
};

module.exports = { upload, convertToBase64 };
