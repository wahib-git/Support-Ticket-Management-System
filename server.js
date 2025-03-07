const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Initialisation de l'application Express
const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route principale
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Import des routes utilisateurs
app.use("/users", userRoutes);

// Port d'écoute du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) //connect to the database
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

const MONGODB_URI = process.env.MONGODB_URI;







