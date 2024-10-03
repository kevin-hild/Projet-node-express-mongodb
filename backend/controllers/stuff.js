// Importation du modèle "Thing" qui représente un objet dans la base de données
const Thing = require('../models/Thing');
const fs = require('fs');

// Création d’un nouvel objet
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing); // Parse le corps de la requête pour obtenir l'objet
  delete thingObject._id; // Supprime l'ID (géré automatiquement par MongoDB)
  delete thingObject._userId; // Supprime l'userId pour éviter qu'il soit modifié manuellement
  const thing = new Thing({
      ...thingObject, // Copie toutes les propriétés de l'objet
      userId: req.auth.userId, // Ajoute l'ID de l'utilisateur authentifié
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Crée l'URL de l'image uploadée
  });

  // Enregistre le nouvel objet dans la base de données
  thing.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})}) // Envoie une réponse de succès
  .catch(error => { res.status(400).json( { error })}); // Envoie une réponse d'erreur en cas de problème
};

// Récupération de tous les objets
exports.getAllThings = (req, res, next) => {
    // Utilisation de la méthode "find" pour récupérer tous les objets de la collection "Thing"
    Thing.find()
      .then(things => res.status(200).json(things)) // Succès : envoie tous les objets récupérés
      .catch(error => res.status(400).json({ error })); // Erreur : mauvaise requête
};

// Récupération d’un objet spécifique par son ID
exports.getOneThing = (req, res, next) => {
    // Recherche d'un objet dans la base de données par son ID (récupéré dans les paramètres de la requête)
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing)) // Succès : envoie l'objet correspondant à l'ID
      .catch(error => res.status(404).json({ error })); // Erreur : objet non trouvé
};

// Mise à jour d’un objet existant
exports.modifyThing = (req, res, next) => {
  // Vérifie si un fichier est envoyé, sinon prend les données du corps de la requête
  const thingObject = req.file ? {
      ...JSON.parse(req.body.thing), // Si un fichier est envoyé, parse les données de l'objet
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Met à jour l'URL de l'image
  } : { ...req.body }; // Sinon, prend directement le corps de la requête

  delete thingObject._userId; // Supprime l'userId pour éviter toute modification manuelle
  Thing.findOne({_id: req.params.id}) // Recherche l'objet à modifier par son ID
      .then((thing) => {
          // Vérifie si l'utilisateur est bien l'auteur de l'objet
          if (thing.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'}); // Non autorisé si l'utilisateur est différent
          } else {
              // Met à jour l'objet avec les nouvelles données
              Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'})) // Succès : envoie un message de confirmation
              .catch(error => res.status(401).json({ error })); // Erreur : non autorisé ou autre problème
          }
      })
      .catch((error) => {
          res.status(400).json({ error }); // Erreur lors de la recherche de l'objet
      });
};

// Suppression d’un objet
exports.deleteThing = (req, res, next) => {
  // Recherche de l'objet à supprimer par son ID
  Thing.findOne({ _id: req.params.id})
      .then(thing => {
          // Vérifie si l'utilisateur est bien l'auteur de l'objet
          if (thing.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'}); // Non autorisé si l'utilisateur est différent
          } else {
              const filename = thing.imageUrl.split('/images/')[1]; // Récupère le nom du fichier image associé à l'objet
              // Supprime le fichier image du serveur
              fs.unlink(`images/${filename}`, () => {
                  // Supprime l'objet de la base de données
                  Thing.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})}) // Succès : envoie un message de confirmation
                      .catch(error => res.status(401).json({ error })); // Erreur lors de la suppression de l'objet
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error }); // Erreur serveur lors de la recherche de l'objet
      });
};
