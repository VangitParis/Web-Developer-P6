//multer gère les fichiers entrants dans les requêtes http
const multer = require('multer');


//MIME = dictionnaire pour résoudre les extensions de fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//configuration de multer pour enregistrer les fichiers entrants (ils seront stockés dans le dossier images du backend)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //filename indique le nom d'origine et remplace les espaces pas _
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
//création d'un middleware avec la fonction single() qui capture les fichiers d'un certain type et 
//les enregistre au système de fichiers du seveur à l'aide du storage 
module.exports = multer({ storage: storage }).single('image');