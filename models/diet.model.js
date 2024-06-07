const mongoose = require("mongoose");

const DietSchema = new mongoose.Schema({
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
});

const Diet = mongoose.model("Diet", DietSchema);
module.exports = Diet;
