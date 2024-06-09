const mongoose = require("mongoose");

const OlahragaSchema = new mongoose.Schema({
  bmi_category: {
    type: String,
  },
  goals: {
    type: String,
  },
  type_recommen: {
    type: String,
  },
  exercise: {
    type: String,
  },
  count: {
    type: String,
  },
  point: {
    type: Number,
  },
  desc: {
    type: String,
  },
  url: {
    type: String,
  },
});

const Olahraga = mongoose.model("Olahraga", OlahragaSchema);
module.exports = Olahraga;
