//Ajout express à l'application
const express = require('express');
//Ajout des cors = échange avec les navigateurs : autorisations
const cors = require('cors');
//Ajout des sessions des cookies
const session = require("cookie-session");
//Ajout de la sécurité helmet pour l'app express
const helmet = require("helmet");
//Ajout de la base de données MongoDB
const mongoose = require('./db/mongoose');
//création de l'application Express
const app = express();
//path pour les images depuis multer
const path = require('path');

//Routes pour les utilisateurs et les sauces
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

const expireDate = new Date(Date.now()+ 60 * 60 * 1000 )//1 heure de session 
app.use(session({ 
  name: 'session',
  keys: [process.env.SECRET_KEY],
  cookie : {
    secure : true,
    httpOnly: true,
    path: '',
    expires : expireDate
    
},
resave: false,
saveUnititilized : true, //Respect RGPD consentement 
 }));



app.use(express.json());
//autoriser certaines app à communiquer avec notre Api grâce aux hearders cors
app.use(cors());
//les requêtes passent par le middleware helmet
app.use(helmet());

//options du middleware helmet pour l'origine des requêtes envoyées
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
//protection des url
app.use(helmet.xssFilter());



//Routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
//renvoyer des fichiers statiques pour une route donnée
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;