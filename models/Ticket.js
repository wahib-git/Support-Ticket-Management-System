const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    category: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // comments: [
    //   {
    //    text: String,
    //    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //  createdAt: { type: Date, default: Date.now },
    //  },
    // ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Ticket", ticketSchema);
