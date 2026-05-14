//Each comment document stores:
//1.comment text
//2.which post the user commented on (postId)
//3.which user wrote the comment (userId)
// {
//     comment,
//     postId,
//     userId
// }

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment is required"],
    },
    postId: {
      //many-to-one
      //ONE post can have multiple comments
      //ONE comment belongs to ONE post
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    userId: {
      //many-to-ONE
      //ONE user can create MANY comments
      //ONE comment belongs to ONE user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timeseries: true },
);

const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel;
