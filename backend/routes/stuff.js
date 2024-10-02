// Configurez le routage
const express = require('express');
const router = express.Router();// créer des routeurs séparés pour chaque route principale
const stuffCtrl = require('../controllers/stuff');// modèle défini dans un fichier séparé (controllers/stuff), représentant un objet dans MongoDB
const auth = require('../middleware/auth');


router.post('/', auth, stuffCtrl.createThing); // Création d’un objet   
router.get('/', auth, stuffCtrl.getAllThings); // Récupération de tous les objets
router.get('/:id', auth, stuffCtrl.getOneThing); // Récupération d’un objet par ID
router.put('/:id', auth, stuffCtrl.modifyThing); // Mise à jour d’un objet
router.delete('/:id', auth, stuffCtrl.deleteThing); // Suppression d’un objet

module.exports = router;