// Importation du modèle "Thing" qui représente un objet dans la base de données
const Thing = require('../models/Thing');
const fs = require('fs');

// Création d’un nouvel objet
exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  delete thingObject._userId;
  const thing = new Thing({
      ...thingObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  thing.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
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
  const thingObject = req.file ? {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete thingObject._userId;
  Thing.findOne({_id: req.params.id})
      .then((thing) => {
          if (thing.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// Suppression d’un objet
exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id})
      .then(thing => {
          if (thing.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = thing.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Thing.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};