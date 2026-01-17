const express = require("express");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const {
  listUsers,
  listAdminRecipes,
  createRecipe,
  deleteRecipe,
} = require("../controllers/adminController");

const router = express.Router();

// Get all users (admin only)
router.get("/users", auth, adminOnly, listUsers);
// Get all recipes (admin only)
router.get("/recipes", auth, adminOnly, listAdminRecipes);
// Create a new recipe (admin only)
router.post("/recipes", auth, adminOnly, createRecipe);
// Delete a recipe by ID (admin only)
router.delete("/recipes/:id", auth, adminOnly, deleteRecipe);

module.exports = router;
