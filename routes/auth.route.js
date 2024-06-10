const express = require("express");
const controller = require("../controllers/auth.controller");
const { verifySignup, authMiddleware, verifyUpdate } = require("../middleware");

const router = express.Router();

router.post(
  "/signup",
  [verifySignup.checkDuplicateEmailAndUsername],
  controller.signup
);
router.post("/signin", controller.signin);
router.get("/activate/:token", controller.activate);
router.post(
  "/update-account",
  [authMiddleware.verifyToken, verifyUpdate.checkDuplicate],
  controller.updateAccount
);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);
router.post(
  "/change-password",
  [authMiddleware.verifyToken],
  controller.changePassword
);
router.post("/changepic", [authMiddleware.verifyToken], controller.changePic);

module.exports = router;
