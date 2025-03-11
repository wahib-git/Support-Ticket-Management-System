const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();


// Création d'un utilisateur
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupération de tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* // Route pour obtenir les agents selon leur spécialisation
router.get('/agents', async (req, res) => {
  try {
    const { specialization } = req.query; // Récupère la spécialisation depuis la requête

    if (!specialization) {
      return res.status(400).json({ error: "Veuillez spécifier une spécialisation" });
    }

    // Rechercher uniquement les utilisateurs avec role "agent" et la spécialisation demandée
    const agents = await User.find({ role: 'agent', specialization });

    if (agents.length === 0) {
      return res.status(404).json({ message: "Aucun agent trouvé pour cette catégorie" });
    }

    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */





module.exports = router;
