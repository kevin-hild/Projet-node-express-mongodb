// Importation des modules nécessaires
const bcrypt = require('bcrypt'); // Module pour hasher et comparer les mots de passe
const User = require('../models/User'); // Modèle utilisateur pour interagir avec la base de données
const jwt = require('jsonwebtoken');

// Fonction d'inscription (signup) : permet de créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    // Hashage du mot de passe fourni par l'utilisateur avec un salage de 10
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'un nouvel utilisateur avec l'email et le mot de passe hashé
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Succès : utilisateur créé
          .catch(error => res.status(400).json({ error })); // Erreur : problème avec les données fournies
      })
      .catch(error => res.status(500).json({ error })); // Erreur : problème lors du hashage du mot de passe
};

// Fonction de connexion (login) : permet à un utilisateur de se connecter
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la base de données par email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                // Si l'utilisateur n'existe pas, on retourne une erreur 401 (non autorisé)
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            // Comparaison du mot de passe fourni avec le mot de passe stocké (hashé)
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        // Si le mot de passe est incorrect, on retourne une erreur 401
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Si tout est correct, on retourne un succès avec l'ID utilisateur et un jeton (token)
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(            // Le token est à générer avec le service JWT
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        ) 
                    });
                })
                .catch(error => res.status(500).json({ error })); // Erreur interne lors de la comparaison
        })
        .catch(error => res.status(500).json({ error })); // Erreur interne lors de la recherche de l'utilisateur
};
