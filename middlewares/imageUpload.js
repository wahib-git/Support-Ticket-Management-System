const multer = require('multer');
const path = require('path');

// Configuration du stockage temporaire
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  
  },
});

// Filtre pour accepter uniquement les images
 const filter = (file, cb) => {
   const fileType = /png|jpg|webp|jpeg/;
   const extname = fileType.test(path.extname(file.originalname));
   if (extname) {
     cb(null, true);
   } else {
     return cb(new Error('invalide mime type'));
   }
};

// Configuration de Multer
const upload = multer({ 
  storage: storage,
  limits: {
     fileSize: 10000000 },// Limite à 5MB
  fileFilter: function(req, file, cb) {
    filter(file, cb);
  },
});


module.exports = { upload };
