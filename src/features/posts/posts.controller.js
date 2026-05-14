import PostRepository from "./posts.repository.js";

export default class PostController {
  //instance of PostRepository
  constructor() {
    this.postRepository = new PostRepository();
  }

  //creating post
  async createPost(req, res, next) {
    try {
      //getting userId
      const userId = req.userId;

      //getting data from req
      const { caption } = req.body;

      const postData = {
        caption,
        userId,
      };

      //if media uploaded
      if (req.file) {
        postData.mediaUrl = "/public/uploads/posts/" + req.file.filename;
      }

      //checking media type (image or video)
      if (req.file.mimetype.startsWith("image")) {
        postData.mediaType = "image";
      } else if (req.file.mimetype.startsWith("video")) {
        postData.mediaType = "video";
      }

      const result = await this.postRepository.createPost(postData);

      //if failed
      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }

      return res.status(201).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //get all posts
  async getAllPosts(req, res, next) {
    try {
      //getting all posts
      const result = await this.postRepository.getAllPosts();

      //if failed
      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //get post by id
  async getPostById(req, res, next) {
    try {
      //getting post id
      const { postId } = req.params;

      const result = await this.postRepository.getPostById(postId);

      //if failed
      if (!result.success) {
        return res.status(404).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e); //control goes to appLevelErrorHandlerMiddleware
    }
  }

  //update post
  async updatePost(req, res, next) {
    try {
      //get post id
      const { postId } = req.params;
      //get userId
      const userId = req.userId;

      //get data from req
      const { caption } = req.body;

      const updatedData = {};
      if (caption) {
        updatedData.caption = caption;
      }
      if (req.file) {
        //upload file path
        updatedData.mediaUrl = "/public/uploads/posts/" + req.file.filename;
      }

      //check media type
      if (req.file.mimetype.startsWith("image")) {
        updatedData.mediaType = "image";
      }
      if (req.file.mimetype.startsWith("video")) {
        updatedData.mediaType = "video";
      }

      //update data
      const result = await this.postRepository.updatePost(
        postId,
        userId,
        updatedData,
      );

      //if failed
      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //delete post
  async deletePost(req, res, next) {
    try {
      //get post id
      const { postId } = req.params;

      //get userId
      const userId = req.userId;

      const result = await this.postRepository.deletePost(postId, userId);

      //if failed
      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
