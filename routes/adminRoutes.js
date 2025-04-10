const express = require("express");
const router = express.Router();
const { authMiddleware, authorizeRoles } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.get(
  "/stats",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getStats
);

router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  adminController.getUsers
);

module.exports = router;
