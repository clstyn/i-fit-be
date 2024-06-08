const express = require("express");
const controller = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/profile", [authMiddleware.verifyToken], controller.getProfile);
router.get("/point", [authMiddleware.verifyToken], controller.getPoint);
router.get(
  "/challenges",
  [authMiddleware.verifyToken],
  controller.getChallenge
);
router.post(
  "/save-bmi-akg",
  [authMiddleware.verifyToken],
  controller.saveBMIAKG
);
router.post(
  "/daily-checkin",
  [authMiddleware.verifyToken],
  controller.dailyCheckin
);
router.post(
  "/save-challenge/:id",
  [authMiddleware.verifyToken],
  controller.saveChallenge
);
router.post(
  "/challenge-done/:id",
  [authMiddleware.verifyToken],
  controller.challengeDone
);
router.post(
  "/redeem/:prizeId",
  [authMiddleware.verifyToken],
  controller.redeemPrize
);
module.exports = router;
