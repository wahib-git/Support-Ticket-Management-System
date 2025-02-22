const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { required: true, unique: true, type: String },
  password: { required: true, type: String },
  //role: { type: String, enum: ["user", "admin"], default: "user" },
  //assignedTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
});
module.exports = mongoose.model("User", userSchema);
