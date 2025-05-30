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
      enum: ["open", "resolved", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Ticket", ticketSchema);
