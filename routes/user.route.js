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
module.exports = router;
