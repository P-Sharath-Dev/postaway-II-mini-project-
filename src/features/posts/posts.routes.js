import express from "express";
import jwtAuth from "../../middlewares/user/jwt.middleware.js";
import PostController from "./posts.controller.js";
import postUpload from "../../middlewares/uploads/postUpload.middleware.js";

const router = express.Router();

//instance of PostController
const postController = new PostController();

//--->create post
//domainName.com/api/posts/create
router.post(
  "/create",
  //file upload
  postUpload.single("media"),
  jwtAuth,
  (req, res, next) => {
    postController.createPost(req, res, next);
  },
);

//--->get all posts
//domainName.com/api/posts/get-all
router.get("/get-all", jwtAuth, (req, res, next) => {
  postController.getAllPosts(req, res, next);
});

//--->get post by id
//domainName.com/api/posts/get/:postId
router.get("/get/:postId", jwtAuth, (req, res, next) => {
  postController.getPostById(req, res, next);
});

//---> update post
//domainName.com/api/posts/update/:postId
router.put(
  "/update/:postId",
  jwtAuth,
  //file upload
  postUpload.single("media"),
  (req, res, next) => {
    postController.updatePost(req, res, next);
  },
);

//---> delete post
//domainName.com/api/posts/delete/:postId
router.delete("/delete/:postId", jwtAuth, (req, res, next) => {
  postController.deletePost(req, res, next);
});

export default router;
