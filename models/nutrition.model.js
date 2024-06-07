const mongoose = require("mongoose");

const NutritionSchema = new mongoose.Schema({
  calories: {
    type: Number,
  },
  proteins: {
    type: Number,
  },
  fats: {
    type: Number,
  },
  carbohydrate: {
    type: Number,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  portion: {
    type: Number,
    default: 1,
  },
});

const Nutrition = mongoose.model("Nutrition", NutritionSchema);
module.exports = Nutrition;
