const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const validationRules = (method) => {
  switch (method) {
    case "register": {  
      return [
        body("name", "Le nom est requis").isString().trim().escape(),
        body("email", "Email invalide").isEmail().normalizeEmail(),
        body("password", "Le mot de passe doit contenir au moins 6 caractères").isLength({ min: 6 }),
        body("role", "Le rôle est requis et doit être parmi [admin, agent, interlocuteur]").isIn([
          "admin",    
          "agent",
          "interlocuteur",
        ]), 
        body("userProfile").custom((value, { req }) => {
          if (req.body.role === "interlocuteur" && !value) {
            throw new Error("Le profil utilisateur est requis pour le rôle interlocuteur");
          }
          if (value && !["enseignant", "etudient", "personnel"].includes(value)) {
            throw new Error("Le profil utilisateur doit être parmi [enseignant, etudient, personnel]");
          }
          return true;
        }),
        body("specialization").custom((value, { req }) => {
          if (req.body.role === "agent" && !value) {  
            throw new Error("La spécialisation est requise pour le rôle agent");
          }
          if (value && !["Infrastructure informatique", "Entretien des locaux", "Sécurité et sûreté"].includes(value)) {
            throw new Error("La spécialisation doit être parmi [Infrastructure informatique, Entretien des locaux, Sécurité et sûreté]");
          } 
          return true;
        }),
      ];
    } 
    case "login": {
      return [
        body("email", "Email invalide").isEmail().normalizeEmail(),  
        body("password", "Le mot de passe est requis").notEmpty().isLength({ min: 5 }),
      ];
    }
    case "createTicket": {
      return [
        body("title", "Le titre est requis").notEmpty().trim().escape(),  
        body("description", "La description est requise").notEmpty().trim().escape(),
        body("category", "La catégorie doit être parmi [Infrastructure informatique,Entretien des locaux,Sécurité et sûreté]").isIn([
          "Infrastructure informatique",
          "Entretien des locaux",
          "Sécurité et sûreté",
        ]), 
        body("priority", "La priorité doit être parmi [urgent, important, mineur]").isIn([
          "urgent",
          "important",
          "mineur",
        ]),
      ];
    }
    case "updateTicket": {
      return [
        body("title", "Le titre est requis").notEmpty().trim().escape(),
        body("description", "La description est requise").notEmpty().trim().escape(),
        body("category", "La catégorie doit être parmi [Infrastructure informatique,Entretien des locaux,Sécurité et sûreté]").isIn([
          "Infrastructure informatique",  
          "Entretien des locaux",
          "Sécurité et sûreté",
        ]), 
        body("priority", "La priorité doit être parmi [urgent, important, mineur]").isIn([
          "urgent",
          "important",  
          "mineur",
        ]),
      ];
    }
    default:
      return [];   
  }
}

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Accès non autorisé, token manquant" });
  }
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET_KEY
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expiré, veuillez vous reconnecter" });
    }
    return res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour autoriser l'accès en fonction des rôles

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "Vous n'avez pas les droits pour accéder à cette ressource",
        });
    }
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles, validationRules };
