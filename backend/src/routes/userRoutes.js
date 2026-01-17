const express = require("express");
const auth = require("../middleware/auth");
const {
  getMe,
  toggleFavorite,
  toggleSavedList,
} = require("../controllers/userController");

const router = express.Router();

// All routes require authentication
router.get("/me", auth, getMe);
router.post("/favorites/toggle", auth, toggleFavorite);
router.post("/list/toggle", auth, toggleSavedList);

module.exports = router;