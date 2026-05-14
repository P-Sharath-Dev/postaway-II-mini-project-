import express from "express";
import CommentController from "./comments.controller.js";
import jwtAuth from "../../middlewares/user/jwt.middleware.js";

const router = express.Router();

//instance of CommentController
const commentController = new CommentController();

//---> create comment
//domainName.com/api/comments/create/:postId
router.post("/create/:postId", jwtAuth, (req, res, next) => {
  commentController.createComment(req, res, next);
});

//---> get comments by postId
//domainName.com/api/comments/get/:postId
router.get("/get/:postId", jwtAuth, (req, res, next) => {
  commentController.getCommentsByPostId(req, res, next);
});

//---> update comment
//domainName.com/api/comments/update/:commentId
router.put("/update/:commentId", jwtAuth, (req, res, next) => {
  commentController.updateComment(req, res, next);
});

//---> delete comment
//domainName.com/api/comments/update/:commentId
router.delete("/delete/:commentId", jwtAuth, (req, res, next) => {
  commentController.deleteComment(req, res, next);
});

export default router;
