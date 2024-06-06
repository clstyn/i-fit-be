const express = require("express");
const controller = require("../controllers/post.controller");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/", controller.findAll);
router.get("/liked", [authMiddleware.verifyToken], controller.getLikedPost);
router.get("/my", [authMiddleware.verifyToken], controller.getMyPost);
router.get("/:id", controller.findOne);

router.post("/", [authMiddleware.verifyToken], controller.create);
router.post(
  "/:id/handlelike",
  [authMiddleware.verifyToken],
  controller.likepost
);

router.put("/:id", [authMiddleware.verifyToken], controller.update);
router.delete("/:id", [authMiddleware.verifyToken], controller.delete);

module.exports = router;
