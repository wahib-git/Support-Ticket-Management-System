const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");
const ticketController = require("../controllers/ticketController");
const { upload } = require('../middlewares/imageUpload');


router.post("/", authMiddleware, authorizeRoles("interlocuteur"), upload.single('image'), ticketController.createTicket);
//router.post("/create", upload.single('image'), ticketController.createTicket);

router.patch("/:id/status", authMiddleware, authorizeRoles("agent"),  ticketController.updateTicketStatus);
router.patch("/:id/close", authMiddleware, authorizeRoles("interlocuteur"), ticketController.closeTicket);
router.get("/mytickets", authMiddleware, authorizeRoles("agent"), ticketController.getMyTickets);
router.get("/", authMiddleware, authorizeRoles("admin"), ticketController.getAllTickets);

//router.get("/", ticketController.getAllTickets);

module.exports = router;
