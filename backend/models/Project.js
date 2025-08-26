const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  name: { type: String, required: true },
  description: { type: String },
  active: { type: Boolean, default: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);
