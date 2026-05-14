import express from "express";
import UserController from "./users.controller.js";
import jwtAuth from "../../middlewares/user/jwt.middleware.js";
import avatarUpload from "../../middlewares/uploads/avatarUpload.middleware.js";

// creating instance of UserController
const userController = new UserController();

const router = express.Router();

//----->signup
//domainName.com/api/users/signup
router.post(
  "/signup",
  //fileUpload
  avatarUpload.single("avatar"),
  (req, res, next) => {
    userController.signUp(req, res, next);
  },
);

//----->login
//domainName.com/api/users/login
router.post("/login", (req, res, next) => {
  userController.login(req, res, next);
});

//----->get user by userId
//domainName.com/api/users/get-details/:userId
router.get("/get-details/:userId", jwtAuth, (req, res, next) => {
  userController.getUserById(req, res, next);
});

//----->get all users
//domainName.com/api/users/get-all-details
router.get("/get-all-details", jwtAuth, (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

//----->update user
//domainName.com/api/users/update-details
router.put(
  "/update-details",
  jwtAuth,
  //fileUpload
  avatarUpload.single("avatar"),
  (req, res, next) => {
    userController.updateUser(req, res, next);
  },
);

//----->logout
//domainName.com/api/users/logout
router.get("/logout", jwtAuth, (req, res, next) => {
  userController.login(req, res, next);
});

//----->logout from all devices
//domainName.com/api/users/logout-all-devices
router.get("/logout-all-devices", jwtAuth, (req, res, next) => {
  userController.logoutFromAllDevices(req, res, next);
});

export default router;
