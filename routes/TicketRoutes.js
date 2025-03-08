const express = require("express");
const Ticket = require('../models/Ticket');  // Importer le modèle Ticket

const router = express.Router();

// Créer un ticket
router.post("/", async (req, res) => {
  try {
    const { title, description, category, createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    const newTicket = new Ticket({ title, description, category, createdBy });
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer tous les tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("createdBy", "name email");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un ticket par ID
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("createdBy", "name email");
    if (!ticket) {
      return res.status(404).json({ error: "Ticket non trouvé" });
    }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour un ticket
router.put("/:id", async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTicket) {
      return res.status(404).json({ error: "Ticket non trouvé" });
    }
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un ticket
router.delete("/:id", async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ error: "Ticket non trouvé" });
    }
    res.json({ message: "Ticket supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
