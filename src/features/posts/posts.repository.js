import PostModel from "./posts.schema.js";
import LikeModel from "../likes/likes.schema.js"; // for counting likes
import CommentModel from "../comments/comments.schema.js"; // for counting comments

export default class PostRepository {
  //create post
  async createPost(postData) {
    try {
      //creating post
      const newPost = new PostModel(postData);
      await newPost.save();

      const createdPost = await PostModel.findById(newPost._id).select(
        "-_id caption imageUrl userId createdAt",
      ); //timestamps are stored in db as createdAt and updatedAt

      return {
        success: true,
        res: createdPost,
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

  //get all posts
  async getAllPosts() {
    try {
      const posts = await PostModel.find(
        {},
        "caption mediaUrl mediaType userId createdAt updatedAt",
      )
        //populate replaces userId with actual user document
        .populate("userId", "-_id name gender avatar");

      if (posts.length == 0) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "there are no posts available",
          },
        };
      }

      const updatedPosts = [];

      //looping through all posts
      for (let i = 0; i < posts.length; i++) {
        const currentPost = posts[i];

        //count total likes of current post
        const likesCount = await LikeModel.countDocuments({
          postId: currentPost._id,
        });

        //count total comments of current post
        const commentsCount = await CommentModel.countDocuments({
          postId: currentPost._id,
        });

        updatedPosts.push({
          //spread operator
          //copies all properties of post object
          ...currentPost.toObject(), //toObject() converts mongoose document into normal javascript object

          likesCount,
          commentsCount,
        });
      }

      return {
        success: true,
        res: updatedPosts,
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

  //get post by id
  async getPostById(postId) {
    try {
      //get post
      const post = await PostModel.findById(postId)

        .populate("userId", "-_id name gender avatar")

        //.select() is used as projection in mongoose
        //this is same as { _id:0, __v:0 }
        .select("-_id -__v");

      //if no post
      if (!post) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "no post found",
          },
        };
      }
      //count total likes of current post
      const likesCount = await LikeModel.countDocuments({
        postId: post._id,
      });

      //count total comments of current post
      const commentsCount = await CommentModel.countDocuments({
        postId: post._id,
      });

      const updatedPost = {
        //spread operator
        //copies all properties of post object
        ...post.toObject(), //toObject() converts mongoose document into normal javascript object

        likesCount,

        commentsCount,
      };

      return {
        success: true,
        res: updatedPost,
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

  //update post
  async updatePost(postId, userId, updatedData) {
    try {
      //1.check if post exists
      const post = await PostModel.findById(postId);

      //2.if post not found
      if (!post) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "post not found",
          },
        };
      }

      //3.checking if post belongs to current user
      if (post.userId.toString() !== userId) {
        return {
          success: false,
          error: {
            statusCode: 403,
            msg: "you are not authorized to update this post",
          },
        };
      }

      //4. update post
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        updatedData,
        { new: true },
      )
        .populate("userId", "-_id name gender avatar")
        .select("-_id -__v");

      return {
        success: true,
        res: updatedPost,
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

  //delete post
  async deletePost(postId, userId) {
    try {
      // check if post exists
      const post = await PostModel.findById(postId);

      //if post not found
      if (!post) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "post not found",
          },
        };
      }

      //check if post not belongs to current User
      if (post.userId.toString() !== userId) {
        return {
          success: false,
          error: {
            statusCode: 403,
            msg: "you are not authorized to delete this post",
          },
        };
      }

      // deleting Post
      await PostModel.findByIdAndDelete(postId);

      return {
        success: true,
        res: "post deleted successfully",
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
