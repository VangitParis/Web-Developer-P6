require('dotenv').config(); 
//compte mongoose = accès à la base de données 
const mongoose = require('mongoose');
const my_db_key = process.env.DB_KEY
mongoose.connect(my_db_key)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
