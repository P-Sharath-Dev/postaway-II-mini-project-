import mongoose from "mongoose";

// storing id of user who liked the post and id of post for which user liked
// Like document looks like
// {
//   userId,
//   postId
// }
const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true },
);

const LikeModel = mongoose.model("Like", likeSchema);
export default LikeModel;
