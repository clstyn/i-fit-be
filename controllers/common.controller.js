const db = require("../models");
const Diet = db.prize;
const Olahraga = db.olahraga;

exports.getOlahragaDetail = (req, res) => {
  const id = req.params.id;

  Olahraga.findById(id)
    .select("-reps -pointAwarded")
    .then((item) => {
      if (!item) {
        return res.status(404).json({
          message: `Olahraga dengan id ${id} tidak ditemukan.`,
        });
      }

      res.status(200).json({
        message: "Telah mendapatkan data olahraga",
        olahraga: item,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message ||
          `Terjadi kesalahan saat mendapatkan olahraga dengan id ${id}`,
      });
    });
};

exports.getDietDetail = (req, res) => {
  const id = req.params.id;

  Diet.findById(id)
    .then((item) => {
      if (!item) {
        return res.status(404).json({
          message: `Diet dengan id ${id} tidak ditemukan.`,
        });
      }

      res.status(200).json({
        message: "Telah mendapatkan data Diet",
        diet: item,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message ||
          `Terjadi kesalahan saat mendapatkan diet dengan id ${id}`,
      });
    });
};
