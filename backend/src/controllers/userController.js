const User = require("../models/User");

// Retrieve current user profile with favorites and saved list
exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized." });

    const user = await User.findById(userId).select(
      "_id username email role favorites savedList createdAt",
    );

    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorites: user.favorites || [],
        savedList: user.savedList || [],
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add or remove a meal from user favorites
exports.toggleFavorite = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const mealId = String(req.body.mealId || "").trim();

    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    if (!mealId)
      return res.status(400).json({ message: "mealId is required." });

    const user = await User.findById(userId).select("_id favorites");
    if (!user) return res.status(404).json({ message: "User not found." });

    // Use Set for efficient add/remove operations
    const set = new Set(user.favorites || []);
    let added = false;

    if (set.has(mealId)) {
      set.delete(mealId);
    } else {
      set.add(mealId);
      added = true;
    }

    user.favorites = Array.from(set);
    await user.save();

    return res.json({
      ok: true,
      added,
      favorites: user.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// Add or remove a meal from user saved list
exports.toggleSavedList = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const mealId = String(req.body.mealId || "").trim();

    if (!userId) return res.status(401).json({ message: "Unauthorized." });
    if (!mealId)
      return res.status(400).json({ message: "mealId is required." });

    const user = await User.findById(userId).select("_id savedList");
    if (!user) return res.status(404).json({ message: "User not found." });

    // Use Set for efficient add/remove operations
    const set = new Set(user.savedList || []);
    let added = false;

    if (set.has(mealId)) {
      set.delete(mealId);
    } else {
      set.add(mealId);
      added = true;
    }

    user.savedList = Array.from(set);
    await user.save();

    return res.json({
      ok: true,
      added,
      savedList: user.savedList,
    });
  } catch (err) {
    next(err);
  }
};
