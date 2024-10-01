// Configurez le routage
const express = require('express');
const router = express.Router();// créer des routeurs séparés pour chaque route principale
const stuffCtrl = require('../controllers/stuff');// modèle défini dans un fichier séparé (controllers/stuff), représentant un objet dans MongoDB


router.post('/', stuffCtrl.createThing); // Création d’un objet   
router.get('/', stuffCtrl.getAllThings); // Récupération de tous les objets
router.get('/:id', stuffCtrl.getOneThing); // Récupération d’un objet par ID
router.put('/:id', stuffCtrl.modifyThing); // Mise à jour d’un objet
router.delete('/:id', stuffCtrl.deleteThing); // Suppression d’un objet

module.exports = router;