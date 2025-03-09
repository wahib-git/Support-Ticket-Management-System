const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { default: mongoose } = require("mongoose");
require("dotenv").config();


const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');


// Initialisation de l'application Express

const app = express();

connectDB();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Déclaration des routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);



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







