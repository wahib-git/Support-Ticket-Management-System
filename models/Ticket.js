const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Infrastructure informatique",
        "Entretien des locaux",
        "Sécurité et sûreté",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["urgent", "important", "mineur"],
      required: true,

    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // L’agent assigné (assignation automatique selon la catégorie)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Ticket", ticketSchema);
