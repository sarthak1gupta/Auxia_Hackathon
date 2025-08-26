const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: String, enum: ["Admin", "Faculty", "Club"], required: true },
  targetAudience: { type: String, enum: ["All", "Course", "Club", "Students"], default: "All" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Announcement", announcementSchema);
