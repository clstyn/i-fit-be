const mongoose = require("mongoose");
const validator = require("validator");

const subSchemaBMI = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  value: {
    type: Number,
  },
  category: {
    type: String,
  },
});

const subSchemaAKG = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  value: {
    type: Number,
  },
});

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  point: {
    type: Number,
    default: 0,
  },
  latestCheckin: {
    type: Date,
    default: Date.now,
  },
  bmis: {
    type: [subSchemaBMI],
    default: [],
  },
  akgs: {
    type: [subSchemaAKG],
    default: [],
  },
});

UserSchema.pre("save", async function (next) {
  console.log(this.email);
  if (validator.isEmail(this.email)) {
    next();
  } else {
    next(new Error("Email tidak valid"));
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
