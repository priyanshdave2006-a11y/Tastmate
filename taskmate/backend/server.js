// server.js
// This is the entry point of our backend application.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ---- Middleware ----
app.use(cors());          // allows the React frontend (different port) to call this API
app.use(express.json());  // allows the server to read JSON sent in request bodies

// ---- Connect to MongoDB ----
connectDB();

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Simple health-check route
app.get("/", (req, res) => {
  res.send("TaskMate API is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TaskMate backend server running on http://localhost:${PORT}`);
});
