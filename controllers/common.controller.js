const db = require("../models");
const Diet = db.diet;
const Prize = db.prize;
const Olahraga = db.olahraga;
const Food = db.food;
const Nutrition = db.nutrition;

exports.getOlahragaDetail = (req, res) => {
  const id = req.params.id;

  Olahraga.findById(id)
    .select("_id exercise type_recommen desc url")
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

exports.getAllPrizes = (req, res) => {
  Prize.find()
    .then((data) => {
      res.status(200).json({
        message: "Berhasil mendapatkan data prize",
        prize: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Terjadi kesalahan saat mendapatkan data prize",
      });
    });
};

exports.getFood = async (req, res) => {
  const { page, search } = req.query;

  try {
    const perPage = 10;
    const currentPage = parseInt(page, 10) || 1;

    if (search) {
      const searchQuery = { name: new RegExp(search, "i") };
      const totalSearchResults = await Nutrition.countDocuments(searchQuery);
      const searchResults = await Nutrition.find(searchQuery)
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .select("-_id -fat -proteins -carbohydrates -image");

      return res.status(200).json({
        totalFoods: totalSearchResults,
        currentPage,
        totalPages: Math.ceil(totalSearchResults / perPage),
        results: searchResults,
      });
    } else if (page) {
      const totalFoods = await Nutrition.countDocuments();
      const foods = await Nutrition.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .select("-_id -fat -proteins -carbohydrates -image");

      return res.status(200).json({
        totalFoods,
        currentPage,
        totalPages: Math.ceil(totalFoods / perPage),
        foods,
      });
    } else {
      const foods = await Nutrition.find().select(
        "-_id -fat -proteins -carbohydrates -image"
      );
      return res.status(200).json(foods);
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};

exports.getRecommendations = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await db.user.findById(userId);

    const bmiCat = user.bmis[user.bmis.length - 1].category;
    const akg = user.akgs[user.akgs.length - 1].value;

    let dietRecommendations;
    let olahragaRecommendations;
    let foodRecommendations;

    dietRecommendations = await Diet.find({
      bmi_categori: bmiCat,
    }).limit(3);

    olahragaRecommendations = await Olahraga.find({
      bmi_category: bmiCat,
    }).limit(3);

    if (akg < 2000) {
      foodRecommendations = await Nutrition.find({
        calories: { $lte: 300 },
      }).limit(6);
    } else if (akg >= 2000 && akg < 2500) {
      foodRecommendations = await Nutrition.find({
        calories: { $gt: 300, $lte: 500 },
      }).limit(6);
    } else {
      foodRecommendations = await Nutrition.find({
        calories: { $gt: 500 },
      }).limit(6);
    }

    return res.status(200).json({
      diets: dietRecommendations,
      olahraga: olahragaRecommendations,
      foods: foodRecommendations,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Kesalahan pada server" });
  }
};
