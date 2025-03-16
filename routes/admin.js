const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { authMiddleware, authorizeRoles } = require('../middleware/auth');


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
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          open: { $sum: { $cond: [{ $eq: ['$_id', 'open'] }, '$count', 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$_id', 'resolved'] }, '$count', 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$_id', 'closed'] }, '$count', 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          open: 1,
          resolved: 1,
          closed: 1,
          resolutionRate: { $divide: ['$resolved', '$total'] }
        }
      }
    ]);
  

    res.json({ categoryStats, topAgent , stats });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

/* 
router.get('/users', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

module.exports = router;
