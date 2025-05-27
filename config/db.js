const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Utilise la base de test si NODE_ENV === 'test'
    const uri = process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;
    await mongoose.connect(uri, {});
    console.log("Connecté à MongoDB avec succès");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;