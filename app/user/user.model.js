// File: User.js
const mongoose = require('mongoose');   // Import mongoose

const userSchema = mongoose.Schema({
  name: {type: String, required :true}, // String is shorthand for {type: String}
  age: Number,
  status: String,
  
}, 
{
timestamps: true, 
versionKey: false
}
); // Timestamps will add createdAt and updatedAt fields

//Buat Model
const User = mongoose.model('User', userSchema);
module.exports = User;
