# Hi Legends 👋
# <p align="center">Gestion de Tickets de Support - Backend</p>

## Description

Ce projet est une application backend développée en NodeJS avec ExpressJS et MongoDB, destinée à la gestion des tickets de support dans une école. Il permet aux enseignants de créer des tickets pour demander de l’aide sur différents sujets, qui sont automatiquement assignés à des agents spécialisés.

L’authentification et l’autorisation sont sécurisées via JSON Web Tokens (JWT).

---

## Fonctionnalités principales

- **Gestion des utilisateurs** : Administrateurs, Agents de support (avec spécialisation), Enseignants.
- **Création de tickets** : Les enseignants créent des tickets avec titre, description, catégorie et priorité.
- **Assignation automatique** : Les tickets sont automatiquement assignés à l’agent spécialisé selon la catégorie.
- **Suivi des tickets** : Agents peuvent marquer les tickets en « in progress » puis « résolu ». Les enseignants peuvent fermer les tickets résolus.
- **Reporting** : L’administrateur peut consulter des statistiques et gérer les utilisateurs.
- **Sécurité** : Authentification sécurisée avec JWT, gestion des rôles et permissions.

---

## Technologies utilisées

- NodeJS
- ExpressJS
- MongoDB (avec Mongoose)
- JSON Web Tokens (JWT) pour l’authentification
- bcryptjs pour le hash des mots de passe

---

## Installation

1. **Cloner le dépôt**

```

https://github.com/wahib-git/Support-Ticket-Management-System.git
cd votre-repo

```

2. **Installer les dépendances**

```

npm install

```

3. **Configurer les variables d’environnement**

Créer un fichier `.env` à la racine et ajouter les variables suivantes :

```

PORT=3000
MONGODB_URI=mongodb://localhost:27017/support_tickets
JWT_SECRET=votre_cle_secrete

```

4. **Lancer le serveur**

```

npm start

```

Le serveur tourne par défaut sur `http://localhost:3000`.

---

## Utilisation

### Authentification

- **Inscription / Création d’utilisateur** (selon besoins)
- **Connexion** : obtention d’un token JWT à inclure dans l’en-tête `Authorization: Bearer token;` pour accéder aux routes protégées.

### Rôles et accès

- **Administrateur** : gestion des utilisateurs, consultation des rapports.
- **Agent de support** : consultation et traitement des tickets assignés.
- **Enseignant** : création et suivi des tickets.

---

## API principales

| Méthode | Endpoint               | Description                          | Accès          |
|---------|------------------------|------------------------------------|----------------|
| POST    | `/auth/login`           | Connexion et récupération du JWT   | Public         |
| POST    | `/tickets`              | Création d’un ticket                | Enseignant     |
| GET     | `/tickets`              | Liste des tickets (filtrée par rôle)| Agent/Admin/Enseignant |
| PATCH   | `/tickets/:id/status`   | Mise à jour du statut du ticket    | Agent/Enseignant |
| GET     | `/users`                | Liste des utilisateurs             | Administrateur |
| POST    | `/users`                | Création d’utilisateur             | Administrateur |

*(La documentation complète des routes est à compléter selon votre implémentation.)*

---

## Modèle de données simplifié

- **User**

  - email (unique)
  - password (hashé)
  - role (`admin`, `agent`, `enseignant`)
  - specialization (pour agents uniquement)

- **Ticket**

  - title
  - description
  - category (`Infrastructure informatique`, `Entretien des locaux`, `Sécurité et sûreté`)
  - priority (`urgent`, `important`, `mineur`)
  - status (`ouvert`, `in progress`, `résolu`, `fermé`)
  - assignedAgent (référence à un utilisateur)

---

## Sécurité

- Les mots de passe sont stockés hashés avec bcrypt.
- L’authentification utilise JWT avec expiration.
- Les routes sont protégées par un middleware qui vérifie le token JWT et les permissions selon le rôle.

---

## Comptes de test fournis

| Rôle       | Email                     | Mot de passe   |
|------------|---------------------------|----------------|
| Administrateur | admin@admin.com           | admin       |
| Agent Infra    | user@agent-inf.com        | agent-inf      |
| Agent Entretien| user@agent-entretien.com  | agent-ent      |
| Agent Sécurité | user@agent-securite.com   | agent-sec      |
| Enseignant    | user@enseignant.com       | enseignant     |

---

## Contribution

Les contributions sont les bienvenues. Merci de créer une branche dédiée et de soumettre une Pull Request.

---

## Contact

Pour toute question, contactez [wahibbachoua95@gmail.com],[https://github.com/chaimahaddaoui].

