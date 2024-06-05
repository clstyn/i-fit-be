const express = require("express");
const controller = require("../controllers/post.controller");

const router = express.Router();

router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.post("/:id/handlelike", controller.likepost);
router.get("/liked", controller.getLikedPost);
router.get("/my", controller.getMyPost);

module.exports = router;
