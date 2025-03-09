const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');

// Route pour récupérer des statistiques simples
router.get('/stats', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    // Statistiques par catégorie (nombre de tickets)
    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Trouver l'agent avec le maximum de tickets résolus
    const resolvedTickets = await Ticket.aggregate([
      { $match: { status: 'resolved' } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let topAgent = null;
    if (resolvedTickets.length > 0) {
      topAgent = await User.findById(resolvedTickets[0]._id, 'email specialization');
    }

    res.json({ categoryStats, topAgent });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// Route pour lister tous les utilisateurs
router.get('/users', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

module.exports = router;
