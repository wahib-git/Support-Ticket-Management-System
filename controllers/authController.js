const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, agent, interlocuteur]
 *               userProfile:
 *                 type: string
 *                 enum: [enseignant, etudient, personnel]
 *               specialization:
 *                 type: string
 *                 enum: [Infrastructure informatique, Entretien des locaux, Sécurité et sûreté]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, userProfile, role, specialization } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "L'utilisateur existe déjà" });
    }

    if (role === "agent" && !specialization) {
      return res
        .status(400)
        .json({ message: "La spécialisation est requise pour le rôle agent" });
    }
    if (role === "interlocuteur" && !userProfile) {
      return res
        .status(400)
        .json({
          message:
            "Le profil utilisateur est requis pour le rôle interlocuteur",
        });
    }

    const user = new User({
      name,
      email,
      password,
      userProfile,
      role,
      specialization,
    });
    await user.save();
    res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isHavePassword = await user.comparePassword(password);
    if (!isHavePassword) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, specialization: user.specialization },
      process.env.SECRET_KEY,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.send({ message: "user logged in successful", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
