const mongoose = require("mongoose");

const DietSchema = new mongoose.Schema({
  bmi_category: {
    type: String,
  },
  goals: {
    type: String,
  },
  name_diet: {
    type: String,
  },
  url: {
    type: String,
  },
  diet_desc: {
    type: String,
  },
});

const Diet = mongoose.model("Diet", DietSchema);
module.exports = Diet;
