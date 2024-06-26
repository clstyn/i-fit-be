const { name } = require("ejs");
const mongoose = require("mongoose");
const validator = require("validator");

const subSchemaBMI = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
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
    default: Date.now,
  },
  value: {
    type: Number,
  },
});

const subSchemaChallenge = new mongoose.Schema({
  name: {
    type: String,
  },
  keterangan: {
    type: String,
  },
  point: {
    type: Number,
  },
  lastDone: {
    type: Date,
    default: null,
  },
});

const getFormattedDate = () => {
  const date = new Date();
  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString("en-US", options);
};

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
    default: null,
  },
  bmis: {
    type: [subSchemaBMI],
    default: [],
  },
  akgs: {
    type: [subSchemaAKG],
    default: [],
  },
  challenges: {
    type: [subSchemaChallenge],
    default: [],
  },
  joined: {
    type: String,
    default: getFormattedDate,
  },
  gender: {
    type: String,
    default: null,
  },
  lastWeight: {
    type: Number,
    default: 0,
  },
  lastHeight: {
    type: Number,
    default: 0,
  },
  age: {
    type: Number,
    default: 0,
  },
  activityLevel: {
    type: String,
    default: null,
  },
  picUrl: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/ifit-iofest.appspot.com/o/recipeImg%2Fpp.jpg?alt=media&token=d2d615d5-44e3-4443-8632-666b1cac9b98",
  },
});

UserSchema.pre("save", async function (next) {
  if (validator.isEmail(this.email)) {
    next();
  } else {
    next(new Error("Email tidak valid"));
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
