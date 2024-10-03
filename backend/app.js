const express = require('express'); // framework minimaliste pour créer des applications web
const bodyParser = require('body-parser'); // body-parser : middleware pour parser le corps des requêtes entrantes en JSON
const mongoose = require('mongoose'); // outil de gestion des documents MongoDB via des modèles
const stuffRoutes = require('./routes/stuff');// importe le module (les routes pour stuff)
const userRoutes = require('./routes/user'); // importe le module (les routes pour user)
const path = require('path');

// Connexion à la base de données MongoDB hébergée via MongoDB Atlas
mongoose.connect('mongodb+srv://dotadouze:t394QxMcrKcDeyII@cluster0.tyujc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Middleware pour configurer les en-têtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// bodyParser.json() : middleware qui transforme le corps des requêtes au format JSON
app.use(bodyParser.json());

// indique à l'application Express d'utiliser ces routes à partir de l'URL /api/stuff
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;