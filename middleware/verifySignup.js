const db = require("../models");
const User = db.user;

checkDuplicateEmailAndUsername = (req, res, next) => {
  const { email, username } = req.body;
  User.findOne({
    $or: [{ email: email }, { username: username }],
  })
    .exec()
    .then((user) => {
      if (user) {
        res
          .status(400)
          .send({ message: "Username atau email telah digunakan" });
        return;
      }
      next();
    })
    .catch((err) => {
      res.status(500).json({ message: err });
      return;
    });
};

const verifySignup = { checkDuplicateEmailAndUsername };

module.exports = verifySignup;
