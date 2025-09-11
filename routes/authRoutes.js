const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validationRules } = require("../middlewares/auth");

router.post("/register", validationRules("register"), authController.register); 
router.post("/login", validationRules("login"), authController.login);

module.exports = router;
