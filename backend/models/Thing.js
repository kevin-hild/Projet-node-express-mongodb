// Importation de Mongoose, un module ODM (Object Data Modeling) pour MongoDB
const mongoose = require('mongoose');

// Création d'un schéma Mongoose pour le modèle "Thing"
// Un schéma définit la structure des documents dans une collection MongoDB
const thingSchema = mongoose.Schema({
  // Champ "title" : de type String et obligatoire
  title: { type: String, required: true },
  
  // Champ "description" : de type String et obligatoire
  description: { type: String, required: true },
  
  // Champ "imageUrl" : de type String et obligatoire (stocke l'URL de l'image de l'objet)
  imageUrl: { type: String, required: true },
  
  // Champ "userId" : de type String et obligatoire (l'identifiant de l'utilisateur qui a créé l'objet)
  userId: { type: String, required: true },
  
  // Champ "price" : de type Number et obligatoire (le prix de l'objet)
  price: { type: Number, required: true },
});

// Exportation du modèle "Thing" basé sur le schéma défini
// Cela permet d'interagir avec la collection "things" dans la base de données MongoDB
module.exports = mongoose.model('Thing', thingSchema);