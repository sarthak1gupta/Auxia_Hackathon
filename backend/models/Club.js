const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Club", clubSchema);
