import express from "express";
import LikeController from "./likes.controller.js";
import jwtAuth from "../../middlewares/user/jwt.middleware.js";

const router = express.Router();

const likeController = new LikeController();

//---> toggle like
//domainName.com/api/likes/toggle/:postId
router.post("/toggle/:postId", jwtAuth, (req, res, next) => {
  likeController.toggleLike(req, res, next);
});

//---> get likes by post id
//domainName.com/api/likes/get/:postId
router.get("/get/:postId", jwtAuth, (req, res, next) => {
  likeController.getLikesByPostId(req, res, next);
});

export default router;
