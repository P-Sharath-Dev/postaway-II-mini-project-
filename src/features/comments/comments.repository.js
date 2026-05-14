import CommentModel from "./comments.schema.js";

export default class CommentRepository {
  //create comment
  async createComment(commentData) {
    try {
      //creating comment
      const newComment = new CommentModel(commentData);

      await newComment.save();

      const createdComment = await CommentModel.findById(newComment._id)
        .select("-_id -__v")
        .populate("userId", "-_id name avatar")
        .populate("postId", "-_id caption");

      return {
        success: true,
        res: createdComment,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }

  //get comments by postId
  async getCommentsByPostId(postId) {
    try {
      const comments = await CommentModel.find({ postId })
        .select("-_id -__v")
        .populate("userId", "-_id name avatar");

      return {
        success: true,
        res: comments,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }

  //update comment
  async updateComment(commentId, userId, updatedData) {
    try {
      //check if comment exists
      const comment = await CommentModel.findById(commentId);

      //comment not found
      if (!comment) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "comment not found",
          },
        };
      }

      //checking if comment belongs to currently logged in user
      if (comment.userId.toString() !== userId) {
        return {
          success: false,
          error: {
            statusCode: 403,
            msg: "you are not authorized to update this comment",
          },
        };
      }

      //update comment
      const updatedComment = await CommentModel.findByIdAndUpdate(
        commentId,
        updatedData,
        { new: true },
      )
        .select("-_id  -__v")
        .populate("userId", "-_id name avatar");

      return {
        success: true,
        res: updatedComment,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }

  //delete comment
  async deleteComment(commentId, userId) {
    try {
      //check if comment exists
      const comment = await CommentModel.findById(commentId);

      //2.comment not found
      if (!comment) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "comment not found",
          },
        };
      }

      //check if comment belongs to currently logged in user
      if (comment.userId.toString() !== userId) {
        return {
          success: false,
          error: {
            statusCode: 403,
            msg: "you are not authorized to delete this comment",
          },
        };
      }

      //deleting comment
      await CommentModel.findByIdAndDelete(commentId);
      return {
        success: true,
        res: "comment deleted successfully",
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }
}

// try {
// } catch (e) {
//   return {
//     success: false,
//     error: {
//       statusCode: 400,
//       msg: e.message,
//     },
//   };
// }
