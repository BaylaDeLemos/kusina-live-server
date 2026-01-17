const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes"); 
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Enable CORS for frontend communication
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Kusina API running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Handle errors globally
app.use(errorHandler);

module.exports = app;
