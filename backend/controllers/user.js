const jwt = require('jsonwebtoken');
//Import de bcrypt pour hasher mot de passe
const bcrypt = require('bcrypt');
//Import de crypto pour hasher l'email dans la bdd
const crypto = require('crypto-js')
//import variable env
require('dotenv').config();
//import du model User 
const User = require('../models/User');


exports.signup = (req, res, next) => {
    //chiffrer email avat de l'envoyer à la bdd
    const emailCryptoJs = crypto.HmacSHA256(req.body.email,
         `${process.env.SECRET_EMAIL}`).toString();
    
    //utilisation de bcrypt pour crypté le mot de passe 
    bcrypt.hash(req.body.password, 10,)
        .then(hash => {
            const user = new User({
                email: emailCryptoJs ,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => { console.log('Utilisateur déjà créé !'),
                 res.status(400).json({ error : 'Utilisateur déjà créé !' })});

        })
        .catch(error => res.status(500).json({ error }));
        
};

exports.login = (req, res, next) => {
    //recherche dans la bdd grâce à findOne()
    //chiffrer email avat de l'envoyer à la bdd
    const emailCryptoJs = crypto.HmacSHA256(req.body.email,
        `${process.env.SECRET_EMAIL}`).toString();
    User.findOne({email : emailCryptoJs  })
        .then(user => {
            if (!user) {
                console.log('Utilisateur Inconnu !');
                return res.status(401).json({ error: 'Utilisateur Inconnu !' });
            }
            //comparer les mots de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log('Mot de passe incorrect !');
                        return res.status(401).json({ error: ' Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        //On utilise la methode sign de jwt pour chiffrer un nouveau token : dans ce token on a l'Id de l 'utilisateur qui sera le payload (=données encodées dans le token)
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.SECRET_TOKEN}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
                

        })
        .catch(error => res.status(500).json({ error }));

};



