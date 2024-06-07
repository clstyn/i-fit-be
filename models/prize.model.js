const mongoose = require("mongoose");

const PrizeSchema = new mongoose.Schema({
  nominal: {
    type: Number,
  },
  boothname: {
    type: String,
  },
  pointNeeded: {
    type: Number,
  },
});

const Prize = mongoose.model("Prize", PrizeSchema);
module.exports = Prize;
