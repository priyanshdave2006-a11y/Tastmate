// routes/userRoutes.js
// Handles viewing and editing the logged-in student's profile.

const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// @route   GET /api/users/profile
// @desc    Get the logged-in user's profile + a small stats summary
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    const totalTasks = await Task.countDocuments({ userId: req.userId });
    const completedTasks = await Task.countDocuments({ userId: req.userId, status: "Completed" });

    res.status(200).json({ user, stats: { totalTasks, completedTasks } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile.", error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update the logged-in user's name (email kept as unique identifier)
router.put("/profile", async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (name) user.name = name;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile.", error: error.message });
  }
});

module.exports = router;
