const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const uniqueValidator = require('mongoose-unique-validator');


mongoose.plugin(mongodbErrorHandler);
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true }
  
});


// plugin moongoose garantie l'unicité des adresses mails dans la bdd
userSchema.plugin(uniqueValidator);
userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema);

