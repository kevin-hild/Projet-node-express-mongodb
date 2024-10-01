const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Thing', thingSchema);;

// Ce code définit le modèle d’un "Thing" avec les champs obligatoires suivants : title, description, imageUrl, userId, et price. 
// Ce modèle peut ensuite être utilisé pour interagir avec la base de données MongoDB (insertion de nouveaux objets, modification, suppression, etc.).