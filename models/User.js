const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent', 'enseignant'], required: true },
  // Pour les agents, stocker la spécialisation
  specialization: { 
    type: String, 
    enum: ['Infrastructure informatique', "Entretien des locaux", 'Sécurité et sûreté'],
    required: function() { return this.role === 'agent'; }
  },
  // Autres attributs éventuels...
});


module.exports = mongoose.model('User', userSchema);

