const mongoose = require("mongoose");

// Establishes connection to MongoDB Atlas database
async function connectDB() {
  // Retrieve MongoDB URI from environment variables
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is missing in backend/.env");

  // Enable strict mode to enforce schema structure
  mongoose.set("strictQuery", true);

  // Connect to MongoDB
  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB Atlas");
}

module.exports = connectDB;