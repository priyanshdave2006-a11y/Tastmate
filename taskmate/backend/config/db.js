// config/db.js
// This file handles the connection between our backend and MongoDB.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() opens a connection to the MongoDB database
    // using the connection string stored in the .env file.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // If the database does not connect, there is no point running the server.
    process.exit(1);
  }
};

module.exports = connectDB;
