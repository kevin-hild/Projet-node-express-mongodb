const express = require('express'); // Framework minimaliste pour créer des applications web avec Node.js
const bodyParser = require('body-parser'); // Middleware pour parser le corps des requêtes entrantes en JSON
const mongoose = require('mongoose'); // Outil pour la gestion des documents MongoDB via des modèles
const stuffRoutes = require('./routes/stuff'); // Importe le module contenant les routes pour les objets "stuff"
const userRoutes = require('./routes/user'); // Importe le module contenant les routes pour la gestion des utilisateurs
const path = require('path'); // Module utilitaire pour travailler avec les chemins de fichiers et répertoires

// Connexion à la base de données MongoDB hébergée via MongoDB Atlas
mongoose.connect('mongodb+srv://dotadouze:t394QxMcrKcDeyII@cluster0.tyujc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,        // Utilise le nouveau parseur d'URL MongoDB
    useUnifiedTopology: true })   // Utilise la nouvelle gestion des connexions MongoDB
  .then(() => console.log('Connexion à MongoDB réussie !')) // Si la connexion réussit
  .catch(() => console.log('Connexion à MongoDB échouée !')); // Si la connexion échoue

const app = express(); // Création d'une application Express

// Middleware pour configurer les en-têtes CORS (Cross-Origin Resource Sharing)
// Cela permet à l'API d'être accessible depuis des domaines différents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines (tous les domaines)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Autorise certains en-têtes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Autorise certaines méthodes HTTP
    next(); // Passe au middleware suivant
});

// bodyParser.json() : Middleware qui transforme le corps des requêtes en JSON automatiquement
app.use(bodyParser.json());

// Utilise les routes définies dans le fichier 'stuffRoutes' pour toutes les requêtes commençant par "/api/stuff"
app.use('/api/stuff', stuffRoutes);

// Utilise les routes définies dans le fichier 'userRoutes' pour toutes les requêtes commençant par "/api/auth" (authentification utilisateur)
app.use('/api/auth', userRoutes);

// Middleware pour servir les fichiers statiques (ici les images) depuis le dossier "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application Express pour l'utiliser dans d'autres fichiers (notamment le serveur)
module.exports = app;
