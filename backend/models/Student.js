const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  usn: { type: String, unique: true, required: true }, // University Seat Number
  semester: { type: Number, required: true },
  collegeEmail: { type: String, required: true, unique: true },
  personalEmail: { type: String },
  phone: { type: String },
  department: { type: String, required: true },
  cgpa: { type: Number, default: null },
  coreCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  electiveCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  clubsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  interests: [{ type: String }],
  feedbacksSubmitted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
  announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", studentSchema);
