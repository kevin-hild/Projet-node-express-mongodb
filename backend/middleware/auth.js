// Importation du module jsonwebtoken pour la gestion des tokens JWT
const jwt = require('jsonwebtoken');

// Middleware d'authentification : vérifie que la requête contient un token valide
module.exports = (req, res, next) => {
    try {
        // Extraction du token depuis l'en-tête Authorization de la requête
        // Format attendu : "Bearer <token>", donc on récupère la seconde partie (le token)
        const token = req.headers.authorization.split(' ')[1];

        // Vérification et décodage du token avec la clé secrète 'RANDOM_TOKEN_SECRET'
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        // Extraction de l'ID utilisateur depuis le token décodé
        const userId = decodedToken.userId;

        // Ajout de l'ID utilisateur à l'objet 'req.auth' pour qu'il soit accessible dans les prochaines middlewares
        req.auth = {
            userId: userId
        };

        // Appel de la fonction next() pour passer à la suite du traitement de la requête
        next();
    } catch(error) {
        // En cas d'échec de vérification du token, on retourne une erreur 401 (non autorisé)
        res.status(401).json({ error });
    }
};
