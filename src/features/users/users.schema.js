import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Name should be min 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "gender is required"],
  },
  avatar: {
    type: String,
    default: "",
  },
  //stores multiple tokens of a user (like tokens from mobile, laptop etc)
  //each login generates a new token
  //we can logout from all devices by clearing all tokens of this array
  tokens: [
    {
      type: String,
    },
  ],
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
