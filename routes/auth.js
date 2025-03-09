const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Route de connexion (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Pour simplifier, on compare directement (à ne pas utiliser en prod)
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe invalide' });
    }
    // Création du token
    const token = jwt.sign(
      { _id: user._id, role: user.role, specialization: user.specialization },
      'votre_clé_secrète',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
