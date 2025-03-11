const bcryptjs = require("bcryptjs");
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent', 'enseignant'], required: true },
 
  specialization: { 
    type: String, 
    enum: ['Infrastructure informatique', "Entretien des locaux", 'Sécurité et sûreté'],
    required: function() { return this.role === 'agent'; }
  },
 
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return bcryptjs.compare(userPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
