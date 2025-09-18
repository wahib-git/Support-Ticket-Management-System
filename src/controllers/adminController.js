const Ticket = require("../models/Ticket");
const User = require("../models/User");

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
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

   
    const agents = await User.find({ role: "agent" }).select(
      "name specialization"
    );

    const agentsStats = await Promise.all(
      agents.map(async (agent) => {
        const assignedCount = await Ticket.countDocuments({
          assignedTo: agent._id,
        });
        const resolvedCount = await Ticket.countDocuments({
          assignedTo: agent._id,
          status: "resolved",
        });
        return {
          name: agent.name,
          specialization: agent.specialization,
          assignedCount,
          resolvedCount,
        };
      })
    );

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
    const priorityStats = await Ticket.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ categoryStats, agentsStats, stats, priorityStats });
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
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
