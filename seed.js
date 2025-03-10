const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect("mongodb+srv://dbChaima:dbChaima@cluster0.5q495.mongodb.net/support-ticket-db", {})
  .then(async () => {
    console.log("Connecté à MongoDB pour le seeding");

    // Suppression des utilisateurs existants
    await User.deleteMany({});

    // Création des utilisateurs
    const users = [
      {
        email: "admin@admin.com",
        password: "admin123",
        role: "admin",
      },
      {
        email: "user@enseignant.com",
        password: "enseignant",
        role: "enseignant",
      },
      {
        email: "user@agent-inf.com",
        password: "agent-inf",
        role: "agent",
        specialization: "Infrastructure informatique",
      },
      {
        email: "user@agent-entretien.com",
        password: "agent-ent",
        role: "agent",
        specialization: "Entretien des locaux",
      },
      {
        email: "user@agent-securite.com",
        password: "agent-sec",
        role: "agent",
        specialization: "Sécurité et sûreté",
      },
    ];

    await User.insertMany(users);
    console.log("Utilisateurs insérés avec succès");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
  });