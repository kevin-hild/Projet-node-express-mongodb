// Importation du module HTTP natif de Node.js pour créer un serveur
const http = require('http');

// Importation de l'application Express définie dans le fichier app.js
const app = require('./app');

// Fonction pour normaliser le port en un nombre, une chaîne, ou false
const normalizePort = val => {
  // Conversion de la valeur en un entier
  const port = parseInt(val, 10);

  // Si la valeur n'est pas un nombre, on la retourne telle quelle
  if (isNaN(port)) {
    return val;
  }
  // Si le port est un nombre positif, on le retourne
  if (port >= 0) {
    return port;
  }
  // Sinon, on retourne false
  return false;
};

// Détermination du port : utilisation du port défini dans les variables d'environnement, sinon 3000 par défaut
const port = normalizePort(process.env.PORT || '3000'); 
app.set('port', port); // On configure l'application pour qu'elle écoute sur ce port

// Gestionnaire d'erreurs pour le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    // Si l'erreur n'est pas liée à l'écoute du serveur, on la relance
    throw error;
  }

  // Récupération de l'adresse du serveur (port ou pipe)
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  // Gestion des erreurs spécifiques au serveur
  switch (error.code) {
    case 'EACCES':
      // Si le port nécessite des privilèges élevés (ex: inférieur à 1024), on affiche une erreur et on quitte
      console.error(bind + ' requires elevated privileges.');
      process.exit(1); // Quitter avec un code d'échec
      break;
    case 'EADDRINUSE':
      // Si le port est déjà utilisé, on affiche une erreur et on quitte
      console.error(bind + ' is already in use.');
      process.exit(1); // Quitter avec un code d'échec
      break;
    default:
      // Pour toute autre erreur, on la relance
      throw error;
  }
};

// Création du serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gestion des événements du serveur

// En cas d'erreur, on utilise le gestionnaire d'erreurs défini plus haut
server.on('error', errorHandler);

// Lorsque le serveur commence à écouter, on affiche le port ou le pipe sur lequel il est actif
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Message indiquant que le serveur est en écoute sur le port spécifié
});

// Le serveur commence à écouter sur le port spécifié
server.listen(port);