// Extract and verify JWT token from Authorization header
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) return res.status(401).json({ message: "Missing token." });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT secret missing." });
    
    // Decode JWT and attach user data to request
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { userId, role, iat, exp }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = auth;