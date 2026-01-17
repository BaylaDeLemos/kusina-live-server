const jwt = require("jsonwebtoken");

// Create and sign a JWT token with user payload
function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in backend/.env");
  // Default expiration: 7 days
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { signToken };
