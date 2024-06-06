const db = require("../models");
const User = db.user;

checkDuplicate = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ message: "Username tidak dapat digunakan" });
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
