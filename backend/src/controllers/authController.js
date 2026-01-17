const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

// Normalize email: trim whitespace and convert to lowercase
function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

// Register a new user with validation and password hashing
exports.signup = async (req, res, next) => {
  try {
    const username = String(req.body.username || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    // Validate required fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email, and password are required." });
    }

    // Enforce minimum password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      passwordHash,
      role: "user",
    });

    // Generate JWT token
    const token = signToken({ userId: user._id, role: user.role });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Authenticate user and return JWT token
exports.login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    // Verify password matches hash
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken({ userId: user._id, role: user.role });

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
