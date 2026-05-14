import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserRepository from "./users.repository.js";
import ApplicationError from "../../error_handler/app.error.js";
import jwt from "jsonwebtoken";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  //signup
  async signUp(req, res, next) {
    try {
      const { name, email, password, gender } = req.body;

      //adding avatar image
      let avatar = "";

      if (req.file) {
        avatar = "/public/uploads/avatars/" + req.file.filename;
      }

      //hashing password
      const hashedPassowrd = await bcrypt.hash(password, 12); //12 salt rounds

      const userData = {
        name,
        email,
        password: hashedPassowrd,
        gender,
        avatar,
      };

      const result = await this.userRepository.signUp(userData);

      if (result.success) {
        return res.status(201).json({
          success: true,
          msg: "user signup successful",
          res: {
            name: result.res.name,
            email: result.res.email,
            avatar: result.res.avatar,
          },
        });
      } else {
        return res.status(404).send("user not created");
      }

      //   return res.status(201).send(newUser); //this will give all the user userData
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      //   console.log("email ", email);

      //checking if user exists
      const userFound = await this.userRepository.getByEmail(email);
      //   console.log("user from controller : ", userFound);
      if (!userFound.success) {
        return res.status(400).send("email not found");
      }

      const user = userFound.res;
      //   console.log("userFound.res", userFound.res);

      //comparing passwords
      const isPasswordMatched = await bcrypt.compare(password, user.password);

      //password mismathc
      if (!isPasswordMatched) {
        return res.status(400).send("incorrect password");
      }

      //create jwt token
      const token = jwt.sign(
        {
          id: user._id.toString(),
          email: user.email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        },
      );

      //storing token in tokens array inside userSchema
      await this.userRepository.storeToken(user._id, token);
      return res.status(200).json({
        msg: "Logged in successful",
        token,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //get user by id
  async getUserById(req, res, next) {
    try {
      //getting userId from params
      const { userId } = req.params;

      const result = await this.userRepository.getUserById(userId);

      //if user not found
      if (!result.success) {
        return res.status(404).send("user not found");
      }

      //user found
      return res.status(200).json({
        // actual user document is inside result.res
        // because repository returns { success, res }
        name: result.res.name,
        email: result.res.email,
        gender: result.res.gender,
        avatar: result.res.avatar,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //get all users
  async getAllUsers(req, res, next) {
    try {
      const result = await this.userRepository.getAllUsers();

      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }

      //sending all users
      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //update user
  async updateUser(req, res, next) {
    try {
      //getting userId
      const userId = req.userId; //gets data from Headers->Authorization->token

      //getting updated userData
      const { name, gender } = req.body;

      const userData = {}; //to store data comming from req.body;
      if (name) {
        userData.name = name;
      }
      if (gender) {
        userData.gender = gender;
      }
      if (req.file) {
        userData.avatar = "/public/uploads/avatars/" + req.file.filename;
      }

      //   const userData = {
      //     name,
      //     gender,
      //     avatar,
      //   };
      const result = await this.userRepository.updateUser(userId, userData);

      //if failed
      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }
      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //logout
  async logout(req, res, next) {
    try {
      //getting user id
      const userId = req.userId;

      //getting current token from Headers
      const token = req.headers.authorization;

      const result = await this.userRepository.logout(userId, token);

      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //logout from all devices
  async logoutFromAllDevices(req, res, next) {
    try {
      const userId = req.userId;

      const result = await this.userRepository.logoutFromAllDevices(userId);

      //if failed
      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
