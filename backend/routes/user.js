// Importation du module Express pour créer des routes
const express = require('express');

// Création d'un routeur Express
const router = express.Router();

// Importation du contrôleur utilisateur qui contient la logique des routes
const userCtrl = require('../controllers/user');

// Route POST pour l'inscription d'un utilisateur
// Appelle la fonction signup du contrôleur userCtrl lorsque l'URL /signup est appelée
router.post('/signup', userCtrl.signup);

// Route POST pour la connexion d'un utilisateur
// Appelle la fonction login du contrôleur userCtrl lorsque l'URL /login est appelée
router.post('/login', userCtrl.login);

// Exportation du routeur pour l'utiliser dans d'autres fichiers de l'application
module.exports = router;
