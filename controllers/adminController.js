const Ticket = require("../models/Ticket");
const User = require("../models/User");

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: [] // Assurez-vous que cette ligne est présente
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       500:
 *         description: Server error
 */
exports.getStats = async (req, res) => {
  try {
    const categoryStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const resolvedTickets = await Ticket.aggregate([
      { $match: { status: "resolved" } },
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let topAgent = null;
    if (resolvedTickets.length > 0) {
      topAgent = await User.findById(
        resolvedTickets[0]._id,
        "email specialization"
      );
    }

    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$count" },
          open: { $sum: { $cond: [{ $eq: ["$_id", "open"] }, "$count", 0] } },
          resolved: {
            $sum: { $cond: [{ $eq: ["$_id", "resolved"] }, "$count", 0] },
          },
          closed: {
            $sum: { $cond: [{ $eq: ["$_id", "closed"] }, "$count", 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          open: 1,
          resolved: 1,
          closed: 1,
          resolutionRate: { $divide: ["$resolved", "$total"] },
        },
      },
    ]);

    res.json({ categoryStats, topAgent, stats });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des statistiques" });
  }
};

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Server error
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};
