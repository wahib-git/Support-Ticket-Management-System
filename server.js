const express = require("express");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();

// Connexion à la base de données
connectDB();

// ... autres middlewares et routes

app.use(express.json()); // Pour parser automatiquement les données JSON envoyées par le client.

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

//const User = mongoose.model("User", userSchema);

// Route pour créer un nouvel utilisateur
app.post("/users", (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save(req.body) // Sauvegarde de l'utilisateur dans la base de données
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Route pour obtenir tous les utilisateurs
app.get("/users", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Port d'écoute du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
