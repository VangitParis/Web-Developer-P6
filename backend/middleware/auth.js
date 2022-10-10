const jwt = require('jsonwebtoken');
require('dotenv').config(); 

module.exports = (req, res, next) => {
   try {
        //on récupère le token depuis le header authorization avec la fonction split(' ') 
       const token = req.headers.authorization.split(' ')[1];
       //la fonction verify décode le token, renverra une erreur si non valide
       const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
       //on récupère userId du token et on l'ajoute à la requête pour les routes
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
       //next() éxécute la fonction si tout s'est bien passé
	next();
   } catch(error) {
    //utilisateur non autorisé 
    console.log('Utilisateur non autorisé');
       res.status(401).json({ error });
   }
};