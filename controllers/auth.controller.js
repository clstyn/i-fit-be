const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const dotenv = require("dotenv");
dotenv.config();

const { sendEmail } = require("../config/email");
const jwtsecret = process.env.JWT_SECRET;

const validator = require("validator");

const validateSignup = (username, password, fullname) => {
  let isValid = true;
  let message = "";

  if (!validator.isLength(username, { min: 1, max: 20 })) {
    isValid = false;
    message = "Username harus memiliki panjang antara 1 - 20 karakter";
  }

  if (!validator.isLength(fullname, { min: 1, max: 50 })) {
    isValid = false;
    message = "Nama lengkap harus memiliki panjang antara 1 - 50 karakter";
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      maxLength: 20,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    console.log(password);
    isValid = false;
    message =
      "Password harus memiliki panjang antara 8 - 20 karakter, minimal 1 huruf besar, 1 huruf kecil, dan 1 angka";
  }

  return {
    isValid,
    message,
  };
};

exports.signup = async (req, res) => {
  const { fullname, username, password, email } = req.body;

  const { isValid, message } = validateSignup(username, password, fullname);

  if (!isValid) {
    return res.status(400).json({ message: message });
  }

  const token = jwt.sign(
    { fullname, username, password, email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  sendEmail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Aktivasi Akun I-Fit",
    html: `<div style="padding: 16px 24px;">
              <h1 style="color: #000; font-size: 24px; margin-bottom: 36px">Aktivasi Akun I-Fit</h1>
              <p style="color: #000; font-size: 16px; margin-bottom: 24px">
                Silahkan klik tautan di bawah ini untuk mengaktivasi akun I-Fit. Abaikan jika Anda tidak meminta email ini.
              </p>
              <a
                href="${process.env.BASE_URL}/auth/activate/${token}"
                style="padding: 5px 10px; color: white; font: semibold; border-radius: 16px; background-color: #4CC2C4;"
                >Aktivasi</a
              >
              <p style="color: #000; font-size: 14px; font-style: italic">Tautan akan kadaluarsa dalam 1 jam</p>
            </div>`,
  })
    .then(() => {
      res.status(200).json({ message: "Email aktivasi telah dikirim" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: err.message || "Terjadi kesalahan pada server" });
    });
};

exports.activate = (req, res) => {
  const { token } = req.params;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Tautan tidak valid" });
    }

    const { fullname, username, password, email } = decoded;

    const user = new User({
      fullname: fullname,
      username: username,
      password: bcrypt.hashSync(password, 8),
      email: email,
    });

    user
      .save()
      .then((user) => {
        res.render("activate", {
          success: true,
          fullname: user.fullname,
          clientUrl: process.env.CLIENT_URL,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          message = "Email atau username sudah terdaftar";
        } else {
          message = err.message;
        }
        res.render("activate", {
          success: false,
          message: message,
          clientUrl: process.env.CLIENT_URL,
        });
      });
  });
};

exports.signin = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Akun tidak ditemukan" });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).json({ message: "Password salah" });
      }

      const payload = {
        user: {
          _id: user._id,
        },
      };

      var token = jwt.sign(payload, jwtsecret, {
        expiresIn: 86400,
      });

      res.status(200).send({
        message: "Berhasil masuk",
        user: user,
        token: token,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message || "Kesalahan pada server" });
    });
};

exports.updateAccount = (req, res) => {
  const { fullname, username } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { fullname: fullname, username: username },
    { new: true }
  )
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Akun tidak ditemukan" });
      }
      res.status(200).json({ message: `Berhasil memperbarui akun`, user });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message || "Kesalahan pada server" });
    });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendEmail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Lupa Kata Sandi Akun I-Fit",
      html: `<div style="padding: 16px 24px;">
              <h1 style="color: #000; font-size: 24px; margin-bottom: 36px">Lupa Kata Sandi Akun I-Fit</h1>
              <p style="color: #000; font-size: 16px; margin-bottom: 24px">
                Silahkan klik tautan di bawah ini untuk memulihkan kata sandi pada akun I-Fit. Abaikan jika Anda tidak meminta email ini.
              </p>
              <a
                href="${process.env.CLIENT_URL}/forgotPassword/${token}"
                style="padding: 5px 10px; color: white; font: semibold; border-radius: 16px; background-color: #4CC2C4;"
                >Aktivasi</a>
              <p style="color: #000; font-size: 14px; font-style: italic">Tautan akan kadaluarsa dalam 1 jam</p>
            </div>`,
    });

    res
      .status(200)
      .json({ message: "Email pemulihan kata sandi telah dikirim" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Tautan tidak valid" });
    }

    try {
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      user.password = bcrypt.hashSync(password, 8);
      await user.save();

      res.status(200).json({ message: "Kata sandi berhasil diperbarui" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message || "Kesalahan pada server" });
    }
  });
};

exports.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Akun tidak ditemukan" });
      }

      var passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

      if (!passwordIsValid) {
        return res.status(401).json({ message: "Password lama salah" });
      }

      user.password = bcrypt.hashSync(newPassword, 8);
      user
        .save()
        .then((user) => {
          res.status(200).json({ message: "Berhasil memperbarui kata sandi" });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ message: err.message || "Kesalahan pada server" });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message || "Kesalahan pada server" });
    });
};
