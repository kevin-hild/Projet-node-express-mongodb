// Importation des modules nécessaires
const bcrypt = require('bcrypt'); // Module pour hasher et comparer les mots de passe de manière sécurisée
const User = require('../models/User'); // Modèle utilisateur pour interagir avec la base de données MongoDB
const jwt = require('jsonwebtoken'); // Module pour créer et vérifier des tokens d'authentification (JWT)

// Fonction d'inscription (signup) : permet de créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hashage du mot de passe fourni par l'utilisateur avec un salage de 10 (nombre de rounds de hashage)
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'un nouvel utilisateur avec l'email et le mot de passe hashé
        const user = new User({
          email: req.body.email, // Récupère l'email du corps de la requête
          password: hash // Stocke le mot de passe hashé
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Succès : réponse de création avec un statut 201
          .catch(error => res.status(400).json({ error })); // Erreur : problème avec les données fournies (ex : email déjà utilisé)
      })
      .catch(error => res.status(500).json({ error })); // Erreur serveur lors du hashage du mot de passe
};

// Fonction de connexion (login) : permet à un utilisateur de se connecter
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la base de données par email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // Si l'utilisateur n'existe pas, on retourne une erreur 401 (non autorisé)
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            // Comparaison du mot de passe fourni par l'utilisateur avec le mot de passe stocké (qui est hashé)
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // Si le mot de passe est incorrect, on retourne une erreur 401 (non autorisé)
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Si le mot de passe est correct, on retourne un succès avec l'ID utilisateur et un jeton d'authentification (JWT)
                    res.status(200).json({
                        userId: user._id, // ID de l'utilisateur dans la base de données
                        token: jwt.sign(  // Création du token JWT avec l'ID utilisateur comme payload
                            { userId: user._id }, // Le payload contient l'ID utilisateur
                            'RANDOM_TOKEN_SECRET', // Clé secrète pour signer le token (devrait être plus complexe en production)
                            { expiresIn: '24h' } // Le token expire après 24 heures
                        ) 
                    });
                })
                .catch(error => res.status(500).json({ error })); // Erreur serveur lors de la comparaison des mots de passe
        })
        .catch(error => res.status(500).json({ error })); // Erreur serveur lors de la recherche de l'utilisateur dans la base de données
};
