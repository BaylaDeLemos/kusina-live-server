const User = require("../models/User");
const Recipe = require("../models/Recipe");

// Fetch all users with selected fields, sorted by creation date
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("_id username email role createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      users: users.map((u) => ({
        id: u._id,
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// Fetch all recipes with selected fields, sorted by creation date
exports.listAdminRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({})
      .select("_id title category area imageUrl youtubeUrl createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      recipes: recipes.map((r) => ({
        id: r._id,
        title: r.title,
        category: r.category,
        area: r.area || "",
        imageUrl: r.imageUrl || "",
        youtubeUrl: r.youtubeUrl || "",
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

// Create a new recipe with validation
exports.createRecipe = async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const category = String(req.body.category || "").trim();
    const area = String(req.body.area || "").trim();
    const imageUrl = String(req.body.imageUrl || "").trim();
    const youtubeUrl = String(req.body.youtubeUrl || "").trim();
    const instructions = String(req.body.instructions || "").trim();

    // Validate required fields
    if (!title || !category || !instructions) {
      return res.status(400).json({
        message: "title, category, and instructions are required.",
      });
    }

    const recipe = await Recipe.create({
      title,
      category,
      area,
      imageUrl,
      youtubeUrl,
      instructions,
      createdBy: req.user?.userId,
    });

    return res.status(201).json({
      recipe: {
        id: recipe._id,
        title: recipe.title,
        category: recipe.category,
        area: recipe.area || "",
        imageUrl: recipe.imageUrl || "",
        youtubeUrl: recipe.youtubeUrl || "",
        createdAt: recipe.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete a recipe by ID
exports.deleteRecipe = async (req, res, next) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ message: "Recipe id is required." });

    const deleted = await Recipe.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found." });

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
