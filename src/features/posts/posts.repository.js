import PostModel from "./posts.schema.js";

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
        "-_id caption imageUrl userId createdAt updatedAt",
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
      return {
        success: true,
        res: posts,
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

      return {
        success: true,
        res: post,
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
