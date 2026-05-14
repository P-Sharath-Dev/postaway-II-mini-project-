import express from "express";
import OtpController from "./otp.controller.js";

//creating instance
const otpcontroller = new OtpController();
const router = express.Router();

//----->send otp
//domainName.com/api/otp/send
router.post("/send", (req, res, next) => {
  otpcontroller.sendOtp(req, res, next);
});

//----->verify otp
//domainName.com/api/otp/verify
router.post("/verify", (req, res, next) => {
  otpcontroller.verifyOtp(req, res, next);
});

//----->reset password
//domainName.com/api/otp/reset-password
router.post("/reset-password", (req, res, next) => {
  otpcontroller.resetPassword(req, res, next);
});

export default router;

//----->signup
//domainName.com/api/users/signup
// router.post(
//   "/signup",
//   //fileUpload
//   avatarUpload.single("avatar"),
//   (req, res, next) => {
//     userController.signUp(req, res, next);
//   },
// );
