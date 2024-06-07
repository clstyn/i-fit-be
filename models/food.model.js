const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  nama: {
    type: String,
  },
  berat: {
    type: String,
  },
  portion: {
    type: Number,
  },
  kalori: {
    type: Number,
  },
});

const Food = mongoose.model("Food", FoodSchema);
module.exports = Food;
