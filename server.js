const express = require("express");
const connectDB = require("./config/db");
const User = require("./models/User");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());

// Configure CORS to allow requests from http://localhost:4200
const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));

// Serve the static files
app.use("/", express.static(path.join(__dirname, "public/")));

// Set the views engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes pour servir les pages HTML
app.get("/", (req, res) => {
  res.render("index");
});

const setupSwagger = require("./swagger/swaggerDocs");
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV !== "test") {
  connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  });
}

module.exports = app;
