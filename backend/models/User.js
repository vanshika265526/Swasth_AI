const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true },
  name: String, // Example extra field
  // Add more fields as needed
});

module.exports = mongoose.model('User', userSchema);
