// Importation du modèle "Thing" qui représente un objet dans la base de données
const Thing = require('../models/Thing');

// Création d’un nouvel objet
exports.createThing = (req, res, next) => {
    // Suppression de l'ID envoyé dans la requête (l'ID sera généré automatiquement par la base de données)
    delete req.body._id;

    // Création d'une nouvelle instance du modèle "Thing" avec les données de la requête
    const thing = new Thing({
      ...req.body // Copie toutes les propriétés du corps de la requête dans l'objet thing
    });

    // Sauvegarde de l'objet dans la base de données
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // Succès : objet créé
      .catch(error => res.status(400).json({ error })); // Erreur : mauvaise requête
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
    // Mise à jour de l'objet identifié par son ID avec les nouvelles données envoyées dans la requête
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !' })) // Succès : objet mis à jour
      .catch(error => res.status(400).json({ error })); // Erreur : mauvaise requête
};

// Suppression d’un objet
exports.deleteThing = (req, res, next) => {
    // Suppression d'un objet de la base de données par son ID
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !' })) // Succès : objet supprimé
      .catch(error => res.status(400).json({ error })); // Erreur : mauvaise requête
};