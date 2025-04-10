const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const ticketController = require("../controllers/ticketController");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("enseignant"),
  ticketController.createTicket
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("agent"),
  ticketController.updateTicketStatus
);

router.patch(
  "/:id/close",
  authMiddleware,
  authorizeRoles("enseignant"),
  ticketController.closeTicket
);

router.get(
  "/mytickets",
  authMiddleware,
  authorizeRoles("agent"),
  ticketController.getMyTickets
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  ticketController.getAllTickets
);

module.exports = router;
