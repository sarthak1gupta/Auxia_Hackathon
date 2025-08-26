const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  facultyId: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  department: { type: String, required: true },
  areasOfExpertise: [{ type: String }],
  coursesAllocated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Faculty", facultySchema);
