// routes/taskRoutes.js
// All routes here are PROTECTED — the `protect` middleware runs first
// on every route, so req.userId is always available.

const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Every route below requires a valid JWT token.
router.use(protect);

// @route   GET /api/tasks
// @desc    Get ALL tasks belonging to the logged-in user
//          Supports optional query params: ?search=&subject=&priority=&status=
router.get("/", async (req, res) => {
  try {
    const { search, subject, priority, status } = req.query;

    // A user can ONLY ever see their own tasks — this is enforced here.
    const filter = { userId: req.userId };

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive search
    }
    if (subject) filter.subject = subject;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ deadline: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks.", error: error.message });
  }
});

// @route   GET /api/tasks/stats/summary
// @desc    Get dashboard statistics: total, pending, completed, overdue
router.get("/stats/summary", async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();

    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: "Completed" });
    const pendingTasks = await Task.countDocuments({ userId, status: "Pending" });
    const overdueTasks = await Task.countDocuments({
      userId,
      status: "Pending",
      deadline: { $lt: now }, // deadline already passed but still pending = overdue
    });
    const recentTasks = await Task.find({ userId }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({ totalTasks, completedTasks, pendingTasks, overdueTasks, recentTasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics.", error: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task by its id
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task.", error: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, subject, deadline, priority } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ message: "Title and deadline are required." });
    }

    const task = await Task.create({
      title,
      description,
      subject,
      deadline,
      priority,
      userId: req.userId, // link this task to the logged-in user
    });

    res.status(201).json({ message: "Task created successfully.", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task.", error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (edit fields OR mark as completed)
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found." });

    const updatableFields = ["title", "description", "subject", "deadline", "priority", "status"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task.", error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task.", error: error.message });
  }
});

module.exports = router;
