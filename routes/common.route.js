const express = require("express");
const controller = require("../controllers/common.controller");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get(
  "/recommend",
  [authMiddleware.verifyToken],
  controller.getRecommendations
);
router.get(
  "/olahraga/:id",
  [authMiddleware.verifyToken],
  controller.getOlahragaDetail
);
router.get("/diet/:id", [authMiddleware.verifyToken], controller.getDietDetail);
router.get("/prizes", [authMiddleware.verifyToken], controller.getAllPrizes);
router.get("/food", controller.getFood);

module.exports = router;
