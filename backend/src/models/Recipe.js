// Define Recipe schema with validation rules
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, required: true, trim: true, maxlength: 40 },
    area: { type: String, trim: true, maxlength: 40 },
    imageUrl: { type: String, trim: true },
    youtubeUrl: { type: String, trim: true },
    instructions: { type: String, required: true, trim: true },
    // Reference to admin who created the recipe
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recipe", recipeSchema);
