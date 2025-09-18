const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");
const ticketController = require("../controllers/ticketController");
const { upload } = require('../middlewares/imageUpload');
const { validationRules } = require("../middlewares/auth");


router.post("/", authMiddleware, authorizeRoles("interlocuteur"), upload.single('image'), validationRules("createTicket"), ticketController.createTicket);
router.patch("/:id/status", authMiddleware, authorizeRoles("agent"),  ticketController.updateTicketStatus);
router.patch("/:id/close", authMiddleware, authorizeRoles("interlocuteur"), ticketController.closeTicket);
router.get("/", authMiddleware, authorizeRoles("admin"), ticketController.getAllTickets);
router.get("/mytickets", authMiddleware, authorizeRoles("interlocuteur", "agent"),ticketController.getMyTickets);
router.get("/:id", authMiddleware, ticketController.getTicketById);
router.delete("/:id", authMiddleware, authorizeRoles("interlocuteur"), ticketController.deleteTicket);
router.patch("/:id", authMiddleware, authorizeRoles("interlocuteur"), upload.single('image'), validationRules("updateTicket"), ticketController.updateTicket);
module.exports = router;