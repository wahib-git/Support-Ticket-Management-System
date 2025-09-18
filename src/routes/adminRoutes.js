const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middlewares/auth");
const adminController = require("../controllers/adminController");

router.get("/stats", authMiddleware, authorizeRoles("admin"), adminController.getStats);
router.get("/users", authMiddleware, authorizeRoles("admin"), adminController.getUsers);
router.delete("/users/:userId", authMiddleware, authorizeRoles("admin"), adminController.deleteUser);

module.exports = router;
