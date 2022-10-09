//Récupérer le shéma des sauces
const Sauce = require('../models/sauce');
const auth = require('../middleware/auth');
//fonction pour supprimer une sauce
const fs = require('fs');

//Ctrl post pour créer une sauce = router.post('/', auth, multer, sauceCtrl.createSauce);
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce créée !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

//Ctrl post pour liker une sauce = router.post('/:id/like', auth, sauceCtrl.like);
exports.like = (req, res, next) => {
  console.log('récupérer la req.body');
  /*requête envoyée sous format JSON contenant les proprités userId et like dans Postman ou depuis l'url port 3000
  {
    "userID" : "63358ca621e5d5a73cf75db0",
    "like" : 1 OU "like" : 0 OU "like" : -1
}
*/
  console.log(userId = req.body.like);

  //récupérer l'id dans l'url de la req body (= contenu de la sauce)
  console.log('récupérer la req.params');
  console.log(req.params);
  console.log({ _id: req.params.id });
  console.log({ _userId: req.auth.userId });



  //récupérer la sauce sélectionnée dans la bdd
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(" Contenu de la promise 'sauce' ");
      console.log(sauce);
      //-------------like = 1 (like = +1)


      //mise en place d'un switch case() pour les cas où l'userId like, ne like pas ou dislike
      switch (req.body.like) {
        case 1:
          //Condition si l'user like la sauce, si userLiked est false (=userId n'est pas dans le tableau)
          // et si like === 1
          if (!sauce.usersLiked.includes(req.body.userId) && (req.body.like === 1)) {
            //console.log((!userId.req.auth));
            console.log("userId n'est pas dans le tableau usersLiked et likes = 1");

            //màj sauce dans bdd mongoDB
            Sauce.updateOne(
              //on récup id de la sauce 
              { _id: req.params.id },
              //méthode $inc = incrémenter la valeur à 1
              {
                $inc: { likes: 1 },
                //méthode $push = pousser l'userId dans le tableau 
                $push: { usersLiked: req.body.userId }
              })
              //réponse reçue de la promise
              .then(() => res.status(201).json({ message: 'userId a liké la sauce ' })

              )
              .catch(error => { res.status(400).json({ error }), console.log('userId inconnu'); });

          }
          break;

        case 0:
          //Condition si l'user ne like pas la sauce, si userLiked est true (= userId est dans le tableau)
          // et like === 0 (likes = -1)

          if (sauce.usersLiked.includes(req.body.userId) && (req.body.like === 0)) {
            console.log("userId est dans le tableau usersLiked ET likes = 0");

            //màj sauce dans bdd
            Sauce.updateOne(
              { _id: req.params.id },
              {
                //retirer le vote existant méthode $inc = incrémenter la valeur à -1 
                $inc: { likes: -1 },
                //méthode $pull = enlever userId du tableau
                $pull: { usersLiked: req.body.userId }
              })
              .then(() => res.status(201).json({ message: "userId n'a pas liké la sauce OU a enlevé son like ET like = 0" })

              )
              .catch(error => { res.status(400).json({ error }), console.log('userId inconnu'); });

          };
          
          //Si l'user a disliké (dislikes = 1), il faut remettre dislikes à 0 si il enlève son dislike (=> dislikes = 0 )
          if (sauce.usersDisliked.includes(req.body.userId) && (req.body.like === 0)) {
            console.log("userId est dans le tableau usersDisliked ET dislikes = 0");

            //màj sauce dans bdd
            Sauce.updateOne(
              { _id: req.params.id },
              {
                //retirer le vote existant 
                $inc: { dislikes: -1 },
                //enlever userId du tableau userDisliked
                $pull: { usersDisliked: req.body.userId }
              })
              .then(() => res.status(201).json({ message: "userId n'a pas disliké la sauce OU a enlevé son dislike ET dislike = 0" })

              )
              .catch(error => {
                res.status(400).json({ error })
              });

          };
          break;


        //Condition si l'user dislike la sauce, si userDisliked est true (= userId est dans le tableau)
        //like === -1 (dislikes = +1)
        case -1:
          if (!sauce.usersDisliked.includes(req.body.userId) && (req.body.like === -1)) {
            console.log("userId n'est pas dans le tableau usersDisliked ET dislikes = 1 ET like = -1");

            //màj sauce dans bdd
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId }
              })
              .then(() => res.status(201).json({ message: 'userId a disliké la sauce ' })

              )
              .catch(error => { res.status(400).json({ error }), console.log('userId inconnu'); });

          };

          break;
      }


    })
    .catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );



};


//Ctrl get pour récupérer une sauce = router.get('/:id', auth, sauceCtrl.getOneSauce);
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Ctrl put pour modifier une sauce = router.put('/:id', auth, multer, sauceCtrl.modifySauce);
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Non autorisé car userID n'est pas propriétaire de la sauce" }), console.log("erreur 403 : MODIF NON AUTORISÉE car userID n'est pas propriétaire de la sauce");
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: ' Sauce modifiée !' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Ctrl delete pour récupérer une sauce = router.delete('/:id', auth, sauceCtrl.deleteSauce);
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: "Non autorisé car userID n'est pas propriétaire de la sauce" }), console.log("erreur 403 : SUPPRESSION NON AUTORISÉE car userID n'est pas propriétaire de la sauce");
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        //supprimer l'image avec fs unlick de multer
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }), console.log("l'userID a supprimé sa sauce"); })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};


//Ctrl get pour récupérer toutes les sauces = router.get('/', auth, sauceCtrl.getAllSauces);
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

