// models/Task.js
// This defines the "shape" of a Task document stored in MongoDB.

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  subject: {
    type: String,
    default: "General",
  },
  deadline: {
    type: Date,
    required: [true, "Deadline is required"],
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"], // only these 3 values are allowed
    default: "Medium",
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  // This links every task to the user who created it.
  // It stores the MongoDB _id of that user (a "reference").
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
