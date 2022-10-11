const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator()
// Ajoutez des propriétés au 
passwordSchema 
.is().min(3)                                    // Longueur minimale 3
.is().max(30)                                  // Longueur maximale 30 
.has().uppercase()                              // Doit contenir des lettres majuscules 
.has().lowercase()                              // Doit contenir des lettres minuscules 
.has().digits(2)                                // Doit avoir au moins 2 chiffres
.has().not().spaces()                           // Ne doit pas avoir d'espaces 
.is().not().oneOf(['Passw0rd', 'Password123']); // Mettre ces valeurs sur liste noire 

//console.log('passwordSchema');
//console.log(passwordSchema);
//console.log(passwordSchema.validate('invalidPASS'));
// => false


module.exports = (req,res, next) => {
    // Valider par rapport à une chaîne de mot de passe 
    if(passwordSchema.validate(req.body.password)){
        next();
        // => true
    }else
    // Récupère une liste complète des règles qui ont échouées 
    return console.log('mot de passe trop faible ! '), 
    res.status(400).json({error : `mot de passe faible 
    ${passwordSchema.validate('req.body.password',{list:true})}` })
    // => [ 'min', 'maj', 'chiffres' ]
};