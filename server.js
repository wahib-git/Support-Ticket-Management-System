const express = require("express");
const connectDB = require("./config/db");


const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/TicketRoutes');
const adminRoutes = require('./routes/adminRoutes');


const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');


const app = express();

connectDB();

app.use(express.json());

// Déclaration des routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));