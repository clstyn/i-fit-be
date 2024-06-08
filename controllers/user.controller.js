const db = require("../models");
const User = db.user;
const Prize = db.prize;
const Olahraga = db.olahraga;

const dotenv = require("dotenv");
dotenv.config();

const { sendEmail } = require("../config/email");
const jwtsecret = process.env.JWT_SECRET;

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

exports.getPoint = (req, res) => {
  const id = req.user._id;

  User.findById(id)
    .select("point latestCheckin")
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: `User dengan id ${id} tidak ditemukan.`,
        });
      }
      res.status(200).json({
        message: "Berhasil mendapatkan data point user",
        point: data.point,
        latestCheckin: data.latestCheckin,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message ||
          `Terjadi kesalahan saat mendapatkan point user dengan id ${id}`,
      });
    });
};

exports.saveBMIAKG = async (req, res) => {
  try {
    const { bmiVal, bmiCat, akg, weight, height, age, gender, activityLevel } =
      req.body;
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

    user.lastWeight = weight;
    user.lastHeight = height;
    user.age = age;
    user.gender = gender;
    user.activityLevel = activityLevel;

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
      return res.status(400).json({ message: "Tunggu waktunya, ya!" });
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

exports.saveChallenge = async (req, res) => {
  const olahragaId = req.params.id;
  const userId = req.user._id;

  try {
    const { nama, reps, pointAwarded } = await Olahraga.findById(
      olahragaId
    ).select("nama reps pointAwarded");

    const challenge = {
      name: nama,
      keterangan: reps,
      point: pointAwarded,
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const challengeExists = user.challenges.some((ch) => ch.name === nama);

    if (challengeExists) {
      return res
        .status(400)
        .json({ message: "Olahraga ini sudah ditambahkan" });
    }

    user.challenges.push(challenge);

    await user.save();

    return res
      .status(200)
      .json({ message: "Olahraga telah disimpan sebagai challenge" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};

exports.challengeDone = async (req, res) => {
  const challengeId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const challenge = user.challenges.id(challengeId);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge tidak ditemukan" });
    }

    const today = new Date();
    const last = new Date(challenge.lastDone);
    const isSameDay = today.toDateString() === last.toDateString();

    if (isSameDay) {
      return res.status(400).json({ message: "Klaim lagi besok" });
    }

    challenge.lastDone = new Date();

    user.point += challenge.point;

    await user.save();

    return res.status(200).json({ message: "Poin sudah ditambahkan" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};

exports.redeemPrize = async (req, res) => {
  const prizeId = req.params.prizeId;
  const userId = req.user._id;

  try {
    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return res.status(404).json({ message: "Hadiah tidak ditemukan" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.point < prize.pointNeeded) {
      return res.status(400).json({ message: "Poin tidak cukup" });
    }

    user.point -= prize.pointNeeded;

    await user.save();

    sendEmail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Email Akun Resmi I-Fit - Penukaran hadiah",
      html: `<div style="padding: 16px 24px;">
              <h1 style="color: #000; font-size: 36px; margin-bottom: 36px">Selamat! Anda berhasil menukarkan poin</h1>
              <p style="color: #000; font-size: 30px; margin-bottom: 24px">
                Anda telah menukarkan poin untuk mendapatkan voucer senilai Rp${prize.nominal} dari ${prize.boothname}.
              </p><p style="color: #000; font-size: 26px; font-style: italic">Tunjukkan email ini di outlet ${prize.boothname}</p>
            </div>`,
    });

    return res
      .status(200)
      .json({ message: "Email berisi voucer telah dikirim" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};

exports.recommend = (req, res) => {};
