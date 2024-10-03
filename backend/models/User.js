// Importation de Mongoose, un module ODM (Object Data Modeling) pour interagir avec MongoDB
const mongoose = require('mongoose');

// Importation du plugin mongoose-unique-validator pour garantir l'unicité de certains champs
const uniqueValidator = require('mongoose-unique-validator');

// Création d'un schéma Mongoose pour le modèle "User" (utilisateur)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },// Champ "email" : de type String, obligatoire, et unique (grâce au plugin uniqueValidator)
  password: { type: String, required: true }// Champ "password" : de type String et obligatoire (mot de passe hashé)

});

// Application du plugin uniqueValidator au schéma pour s'assurer que l'email est unique
userSchema.plugin(uniqueValidator);

// Exportation du modèle "User" basé sur le schéma défini
// Cela permet d'interagir avec la collection "users" dans la base de données MongoDB
module.exports = mongoose.model('User', userSchema);
