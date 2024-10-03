// Configurez le routage
const express = require('express');
const router = express.Router(); // créer des routeurs séparés pour chaque route principale
const stuffCtrl = require('../controllers/stuff'); // modèle défini dans un fichier séparé (controllers/stuff), représentant un objet dans MongoDB
const auth = require('../middleware/auth'); // middleware d'authentification pour protéger les routes
const multer = require('../middleware/multer-config'); // middleware pour gérer les fichiers téléchargés (images)

// Route POST : création d’un objet avec authentification et gestion d'upload d'image
router.post('/', auth, multer, stuffCtrl.createThing); // Création d’un objet   

// Route GET : récupération de tous les objets avec authentification
router.get('/', auth, stuffCtrl.getAllThings); // Récupération de tous les objets

// Route GET : récupération d’un objet spécifique par son ID avec authentification
router.get('/:id', auth, stuffCtrl.getOneThing); // Récupération d’un objet par ID

// Route PUT : mise à jour d’un objet par son ID avec authentification et gestion des images
router.put('/:id', auth, multer, stuffCtrl.modifyThing); // Mise à jour d’un objet

// Route DELETE : suppression d’un objet par son ID avec authentification
router.delete('/:id', auth, stuffCtrl.deleteThing); // Suppression d’un objet

module.exports = router; // exportation du routeur pour pouvoir l'utiliser dans d'autres fichiers
