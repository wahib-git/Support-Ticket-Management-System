const Ticket = require("../models/Ticket");
const User = require("../models/User");
const sendNotificationEmail = require("../utils/mailer");

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the ticket
 *               description:
 *                 type: string
 *                 description: Description of the issue
 *               category:
 *                 type: string
 *                 enum: [Infrastructure informatique, Entretien des locaux, Sécurité et sûreté]
 *                 description: Category of the ticket
 *               priority:
 *                 type: string
 *                 enum: [urgent, important, mineur]
 *                 description: Priority level of the ticket
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to attach to the ticket
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       500:
 *         description: Server error
 */
exports.createTicket = async (req, res) => {
  const { title, description, category, priority, image } = req.body;
  try {
    let ticket = new Ticket({
      title,
      description,
      category,
      priority,
      image,
      createdBy: req.user._id,
    });

    const agent = await User.findOne({
      role: "agent",
      specialization: category,
    });
    if (agent) {
      ticket.assignedTo = agent._id;
    }

    ticket = await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du ticket" });
  }
};

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   patch:
 *     summary: Update the status of a ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, resolved, closed]
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
exports.updateTicketStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["open", "in_progress", "resolved", "closed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    let ticket = await Ticket.findById(req.params.id).populate({
      path: "createdBy",
      select: "email",
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }

    if (!ticket.createdBy || !ticket.createdBy.email) {
      return res.status(500).json({
        message: "L'enseignant associé au ticket n'a pas d'adresse e-mail.",
      });
    }

    if (ticket.assignedTo.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Ce ticket ne vous est pas assigné" });
    }

    ticket.status = status;
    ticket = await ticket.save();

    sendNotificationEmail(
      ticket.createdBy.email,
      "Mise à jour de votre ticket",
      `Bonjour,\n\nLe statut de votre ticket "${ticket.title}" a été mis à jour à "${status}".\n\nMerci.\nL'équipe de support`
    );

    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du ticket" });
  }
};

/**
 * @swagger
 * /api/tickets/{id}/close:
 *   patch:
 *     summary: Close a ticket
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket closed successfully
 *       400:
 *         description: Ticket must be resolved before closing
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
exports.closeTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }

    if (ticket.createdBy.toString() !== req.user._id) {
      return res.status(403).json({
        message: "Vous n'avez pas l'autorisation de fermer ce ticket",
      });
    }
    if (ticket.status !== "resolved") {
      return res.status(400).json({
        message: "Le ticket doit être résolu avant de pouvoir être fermé",
      });
    }

    ticket.status = "closed";
    ticket = await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la fermeture du ticket" });
  }
};

/**
 * @swagger
 * /api/tickets/mytickets:
 *   get:
 *     summary: Get tickets assigned to the logged-in agent
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned tickets
 *       500:
 *         description: Server error
 */
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user._id });
    res.json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tickets" });
  }
};

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets (Admin only)
 *     tags: [Tickets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tickets
 *       500:
 *         description: Server error
 */
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "email role")
      .populate("assignedTo", "email specialization");
    res.json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des tickets" });
  }
};
