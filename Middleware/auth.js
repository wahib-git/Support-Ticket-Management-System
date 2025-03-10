const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Récupération du token dans l'en-tête Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }
  try {
    const decoded = jwt.verify(token, 'votre_clé_secrète');
    req.user = decoded; // Contient _id, role, et éventuellement specialization
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour autoriser l'accès en fonction des rôles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Vous n\'avez pas les droits pour accéder à cette ressource' });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };