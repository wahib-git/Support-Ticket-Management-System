const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authMiddleware, authorizeRoles } = require('../Middleware/auth');

// 1. Création d'un ticket par l'enseignant
router.post('/', authMiddleware, authorizeRoles('enseignant'), async (req, res) => {
  const { title, description, category, priority } = req.body;
  try {
    // Création du ticket
    let ticket = new Ticket({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
    });

    // Assignation automatique : trouver l'agent dont la spécialisation correspond à la catégorie
    const agent = await User.findOne({ role: 'agent', specialization: category });
    if (agent) {
      ticket.assignedTo = agent._id;
    }

    ticket = await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du ticket' });
  }
});

// 2. L'agent met à jour le statut d'un ticket (par ex. passage à "in_progress" ou "resolved")
router.patch('/:id/status', authMiddleware, authorizeRoles('agent'), async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }
  try {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }
    // Vérifier que le ticket est bien assigné à l'agent connecté
    if (ticket.assignedTo.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Ce ticket ne vous est pas assigné' });
    }
    ticket.status = status;
    ticket = await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du ticket' });
  }
});

// 3. L'enseignant peut fermer un ticket (uniquement si son statut est "resolved")
router.patch('/:id/close', authMiddleware, authorizeRoles('enseignant'), async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }
    // Vérifier que le ticket a été créé par l'enseignant connecté
    if (ticket.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Vous n\'avez pas l\'autorisation de fermer ce ticket' });
    }
    if (ticket.status !== 'resolved') {
      return res.status(400).json({ message: 'Le ticket doit être résolu avant de pouvoir être fermé' });
    }
    ticket.status = 'closed';
    ticket = await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la fermeture du ticket' });
  }
});

// 4. Un agent peut consulter la liste de ses tickets assignés
router.get('/mytickets', authMiddleware, authorizeRoles('agent'), async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tickets' });
  }
});

// 5. Un admin peut consulter tous les tickets (avec quelques détails)
router.get('/', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('createdBy', 'email role')
      .populate('assignedTo', 'email specialization');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tickets' });
  }
});

module.exports = router;