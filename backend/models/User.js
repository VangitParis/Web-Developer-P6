const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// plugin moongoose garantie l'unicité des adresses mails dans la base de données
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);