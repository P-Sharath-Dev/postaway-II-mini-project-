import CommentRepository from "./comments.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  //create comment
  async createComment(req, res, next) {
    try {
      //getting loggedIn user's id from jwt middleware
      const userId = req.userId;

      //getting postId from params
      const { postId } = req.params;

      //getting comment text from body
      const { comment } = req.body;

      const commentData = {
        comment,
        postId,
        userId,
      };

      const result = await this.commentRepository.createComment(commentData);

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

  //get comments by postId
  async getCommentsByPostId(req, res, next) {
    try {
      //get postId
      const { postId } = req.params;

      const result = await this.commentRepository.getCommentsByPostId(postId);

      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }
      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);

      next(e);
    }
  }

  //updateComment
  async updateComment(req, res, next) {
    try {
      //getting commentId
      const { commentId } = req.params;

      //getting userId
      const userId = req.userId;

      //getting comment
      const { comment } = req.body;

      const updatedData = {};
      if (comment) {
        updatedData.comment = comment;
      }

      const result = await this.commentRepository.updateComment(
        commentId,
        userId,
        updatedData,
      );
      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }
      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);

      next(e);
    }
  }

  //delete comment
  async deleteComment(req, res, next) {
    try {
      //getting commentId
      const { commentId } = req.params;

      //getting userId
      const userId = req.userId;

      const result = await this.commentRepository.deleteComment(
        commentId,
        userId,
      );

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

// try {
//   if (!result.success) {
//     return res.status(400).send(result.error.msg);
//   }
// return res.status(200).send(result.res);
// } catch (e) {
//   console.log(e);

//   next(e);
// }
