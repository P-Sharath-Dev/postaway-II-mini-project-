import mongoose from "mongoose";
import ApplicationError from "../../error_handler/app.error.js";
import UserModel from "./users.schema.js";

export default class UserRepository {
  //signup
  async signUp(user) {
    try {
      //check if email already exists
      const existingUser = await UserModel.findOne({ email: user.email });
      if (existingUser) {
        return {
          success: false,
          error: {
            statusCode: 400,
            msg: "Email already exists",
          },
        };
      }

      const newUser = new UserModel(user);
      //   console.log("newUser from repo : ", newUser);
      await newUser.save();
      return {
        success: true,
        res: newUser,
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

  //get by EMAIL
  async getByEmail(email) {
    try {
      //   console.log("email from repo : ", email);
      //finding by email
      const user = await UserModel.findOne({ email });
      //   console.log("user from getByEmail : ", user);
      if (!user) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "user not found",
          },
        };
      }
      return {
        success: true,
        res: user,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 404,
          msg: e.message,
        },
      };
    }
  }

  //store tokens after LOGIN
  async storeToken(userId, token) {
    try {
      //finding user
      const user = await UserModel.findOne(userId);

      //adding token to tokens inside userSchema
      user.tokens.push(token);
      await user.save();
      return {
        success: true,
        res: user,
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

  //get user by id
  async getUserById(userId) {
    try {
      //find user by id
      const user = await UserModel.findById(userId);

      //if user not found
      if (!user) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "user not found",
          },
        };
      }

      //user found
      return {
        success: true,
        res: user,
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

  //get all users
  async getAllUsers() {
    try {
      //finding all users
      const users = await UserModel.find({}, "-_id name email gender avatar"); //projection
      //the above line is same as { _id:0, name:1, email:1, gender:1, avatar:1 }.
      // -_id means same as _id:0
      return {
        success: true,
        res: users,
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

  //update user details
  async updateUser(userId, userData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
        new: true, //returns updated document
      }).select("-_id name email gender avatar"); //select() is used as projection in mongoose
      //this is same as { _id:0, name:1, email:1, gender:1, avatar:1 }

      //user not found
      if (!updatedUser) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "user not found",
          },
        };
      }
      return {
        success: true,
        res: updatedUser,
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

  //logout
  async logout(userId, token) {}

  //logout from all devices
  async logoutFromAllDevices(userId) {}
}
