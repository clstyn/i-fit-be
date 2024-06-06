const db = require("../models");
const User = db.user;

checkDuplicate = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user) {
        req.foundUser = user._id;
      }
      next();
    })
    .catch((err) => {
      res.status(500).json({ message: err.message || "Kesalahan pada server" });
    });
};

const verifyUpdate = {
  checkDuplicate,
};

module.exports = verifyUpdate;
