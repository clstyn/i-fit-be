const db = require("../models");
const User = db.user;

exports.getProfile = (req, res) => {
  const id = req.user._id;

  User.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: `User dengan id ${id} tidak ditemukan.`,
        });
      }
      res.status(200).json({
        message: "Berhasil mendapatkan data profile user",
        user: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message ||
          `Terjadi kesalahan saat mendapatkan user dengan id ${id}`,
      });
    });
};

exports.saveBMIAKG = async (req, res) => {
  try {
    const { bmiVal, bmiCat, akg } = req.body;
    const userId = req.user._id;

    const setBMI = {
      value: bmiVal,
      category: bmiCat,
    };

    const setAKG = {
      value: akg,
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    user.bmis.push(setBMI);
    user.akgs.push(setAKG);

    if (user.bmis.length > 3) {
      user.bmis.shift();
    }
    if (user.akgs.length > 3) {
      user.akgs.shift();
    }

    await user.save();

    res.status(200).json({ message: "Data BMI dan AKG berhasil disimpan" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};

exports.dailyCheckin = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const today = new Date();
    const lastCheckinDate = new Date(user.latestCheckin);
    const isSameDay = today.toDateString() === lastCheckinDate.toDateString();

    if (isSameDay) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini" });
    }

    user.point += 25;
    user.latestCheckin = new Date();

    await user.save();

    return res.status(200).json({ message: "Check-in harian berhasil" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};
