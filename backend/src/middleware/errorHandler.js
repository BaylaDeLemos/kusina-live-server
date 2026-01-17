// Handle errors and format error responses
function errorHandler(err, req, res, next) {
  console.error(err);

  // Handle MongoDB duplicate key error
  if (err && err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value." });
  }

  return res.status(500).json({ message: "Server error." });
}

module.exports = errorHandler;
