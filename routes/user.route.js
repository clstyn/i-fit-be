const express = require("express");
const controller = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/profile", [authMiddleware.verifyToken], controller.getProfile);
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
  "/save-challenge",
  [authMiddleware.verifyToken],
  controller.saveChallenge
);
router.post(
  "/challenge-done",
  [authMiddleware.verifyToken],
  controller.challengeDone
);
router.post(
  "/redeem/:prizeId",
  [authMiddleware.verifyToken],
  controller.redeemPrize
);
module.exports = router;
