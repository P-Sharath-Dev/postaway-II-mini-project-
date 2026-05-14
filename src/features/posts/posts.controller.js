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
      const { caption, imageUrl } = req.body;

      const postData = {
        caption,
        imageUrl,
        userId,
      };
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
      const { caption, imageUrl } = req.body;

      const updatedData = {};
      if (caption) {
        updatedData.caption = caption;
      }
      if (imageUrl) {
        updatedData.imageUrl = imageUrl;
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
