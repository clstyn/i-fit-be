const express = require("express");
const controller = require("../controllers/common.controller");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get(
  "/olahraga/:id",
  [authMiddleware.verifyToken],
  controller.getOlahragaDetail
);
router.get("/diet/:id", [authMiddleware.verifyToken], controller.getDietDetail);
router.get("/prizes", [authMiddleware.verifyToken], controller.getAllPrizes);

module.exports = router;
