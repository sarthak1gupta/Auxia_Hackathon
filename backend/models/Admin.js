const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminId: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Admin", adminSchema);
