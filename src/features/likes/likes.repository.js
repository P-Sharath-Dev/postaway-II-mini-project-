import LikeModel from "./likes.schema.js";

export default class LikeRepository {
  //adding like. if like already exists then removing like
  async toggleLike(userId, postId) {
    try {
      //checking if like already exists
      const existingLike = await LikeModel.findOne({ userId, postId });

      //if like already exists
      if (existingLike) {
        await LikeModel.findByIdAndDelete(existingLike._id);
        return {
          success: true,
          res: "like removed from the post",
        };
      }

      //if not liked
      const newLike = new LikeModel({ userId, postId });
      await newLike.save();

      return {
        success: true,
        res: "you liked this post",
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

  //get all users who liked the post
  async getLikesByPostId(postId) {
    try {
      const likes = await LikeModel.find({ postId })
        .select("-__v")
        .populate("userId", "_id name email");

      //no likes found
      if (likes.length == 0) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "no one liked this post",
          },
        };
      }
      return {
        success: true,
        res: likes,
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
