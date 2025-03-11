const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }

    if (role === 'agent' && !specialization) {
      res.status(400).json({ message: 'La spécialisation est requise pour le rôle agent' });
    }

    const user = new User({ name, email, password, role, specialization });
    await user.save();
    res.status(201).json({ message: 'Inscription réussie'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    const isHavePassword = await user.comparePassword(password);
    if (!isHavePassword) {
      res.status(400).send({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { _id: user._id, role: user.role, specialization: user.specialization }, process.env.SECRET_KEY
  );

    res.send({ message: "user logged in successful", token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
