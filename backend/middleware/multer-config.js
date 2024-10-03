const multer = require('multer'); // Importation du module multer pour la gestion des fichiers

// Dictionnaire des types MIME pour définir les extensions de fichier correspondantes
const MIME_TYPES = {
  'image/jpg': 'jpg', // Associe le type MIME "image/jpg" à l'extension "jpg"
  'image/jpeg': 'jpg', // Associe le type MIME "image/jpeg" à l'extension "jpg"
  'image/png': 'png'   // Associe le type MIME "image/png" à l'extension "png"
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
  // Définition de l'emplacement de stockage des fichiers
  destination: (req, file, callback) => {
    callback(null, 'images'); // Stocke les fichiers dans le dossier "images"
  },
  // Définition du nom du fichier à enregistrer
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Remplace les espaces dans le nom du fichier par des underscores
    const extension = MIME_TYPES[file.mimetype]; // Récupère l'extension du fichier à partir de son type MIME
    callback(null, name + Date.now() + '.' + extension); // Concatène le nom du fichier, la date actuelle et l'extension pour créer un nom unique
  }
});

// Exportation du middleware multer configuré pour gérer un fichier unique (de type "image")
module.exports = multer({storage: storage}).single('image');
