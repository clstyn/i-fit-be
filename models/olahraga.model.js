const mongoose = require("mongoose");

const OlahragaSchema = new mongoose.Schema({
  nama: {
    type: String,
  },
  desc: {
    type: String,
  },
  picUrl: {
    type: String,
  },
  references: {
    type: [String],
  },
  reps: {
    type: String,
  },
  pointAwarded: {
    type: Number,
  },
});

const Olahraga = mongoose.model("Olahraga", OlahragaSchema);
module.exports = Olahraga;
