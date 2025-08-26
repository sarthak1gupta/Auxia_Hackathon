const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String },
  type: { type: String, enum: ["core", "elective"], required: true },
  seatLimit: { type: Number, required: true },
  seatsFilled: { type: Number, default: 0 },
  faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  semester: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", courseSchema);
