const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["members-only", "open"], required: true },
  date: { type: Date },
  announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
