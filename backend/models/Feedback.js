const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  feedbackText: { type: String, required: true },
  anonymous: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
