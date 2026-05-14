import mongoose from "mongoose";

const postSchema = new mongoose.Schema( //.Schema creates schema
  {
    caption: {
      type: String,
      required: [true, "Caption is required"],
    },
    imageUrl: {
      type: String,
      default: "", // if no data received from user then empty string will be added as value
    },
    userId: {
      //one-to-many relationship
      //One user can create many post, one post can have one user(one post perspective)
      type: mongoose.Schema.Types.ObjectId, //id of users who created post
      ref: "User",
    },
  },
  {
    // timestamps as second object. timestamp is added when post created.
    timestamps: true, //timestamps are stored in db as createdAt and updatedAt
  },
);

const PostModel = mongoose.model("Post", postSchema); //.model creates model

export default PostModel;
