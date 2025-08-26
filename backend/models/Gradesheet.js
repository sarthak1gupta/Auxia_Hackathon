const mongoose = require("mongoose");

const gradesheetSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  semester: { type: Number, required: true },
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      marks: { type: Number },
      grade: { type: String }
    }
  ],
  cgpa: { type: Number },
  released: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gradesheet", gradesheetSchema);
