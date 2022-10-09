const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
//const { response } = require('../app');
require('dotenv').config(); 


exports.signup = (req, res, next) => {
    //utilisation de bcrypt pour crypté le mot de passe 
    bcrypt.hash(req.body.password, 10,)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error })), console.log('Utilisateur déjà créé !');

        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log('Utilisateur Inconnu !');
                return res.status(401).json({ error : 'Utilisateur Inconnu !' });
            }
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
                            process.env.SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};

