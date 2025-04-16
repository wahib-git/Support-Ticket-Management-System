const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");
const ticketController = require("../controllers/ticketController");
const { upload, convertToBase64 } = require('../middlewares/imageUpload');


router.post("/", authMiddleware, authorizeRoles("enseignant"), upload.single('image'), convertToBase64, ticketController.createTicket);

router.patch("/:id/status", authMiddleware, authorizeRoles("agent"),  ticketController.updateTicketStatus);
router.patch("/:id/close", authMiddleware, authorizeRoles("enseignant"), ticketController.closeTicket);
router.get("/mytickets", authMiddleware, authorizeRoles("agent"), ticketController.getMyTickets);
router.get("/", authMiddleware, authorizeRoles("admin"), ticketController.getAllTickets);

module.exports = router;
