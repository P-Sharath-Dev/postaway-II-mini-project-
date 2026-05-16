// Add valid EMAIL and PASSWORD in .env for OTP email functionality
// Example:

// EMAIL=your_email
// PASSWORD=your_app_password

// Add valid EMAIL and PASSWORD in .env for OTP email functionality
// Example:

// EMAIL=your_email
// PASSWORD=your_app_password

// Add valid EMAIL and PASSWORD in .env for OTP email functionality
// Example:

// EMAIL=your_email
// PASSWORD=your_app_password

import bcrypt from "bcrypt";
import OptRepository from "./otp.repository.js";
import transporter from "../../utils/nodeMailer.js";
import UserModel from "../users/users.schema.js";

export default class OtpController {
  constructor() {
    this.optRepository = new OptRepository();
  }

  //send otp
  async sendOtp(req, res, next) {
    try {
      //getting email
      const { email } = req.body;

      //generate 4digit otp
      const otp = Math.floor(Math.random() * 9000 + 1000);

      //save otp in db
      const result = await this.optRepository.saveOtp(email, otp);

      //if failed
      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      //send email
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "password reset otp",
        text: `your OTP is ${otp}`,
      });
      return res.status(200).send("OTP sent successfully");
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //verify otp
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await this.optRepository.findOtp(email, otp);

      // otp not found
      if (!result.success) {
        // return res.status(result.error.statusCode).send(result.error.msg);

        //increase wrong otp attempts
        const attemptResult = await this.optRepository.increaseAttempts(email);

        //get updated attempts
        const attempts = attemptResult.res.attempts;

        //sending warning email after three attempts
        if (attempts >= 3) {
          await transporter.sendMail({
            sender: process.env.EMAIL,
            to: email,
            subject: "Security alert",
            text: "someone is trying to access your account. ",
          });
          return res
            .status(result.error.statusCode)
            .send("you have entered multiple wrong otp's");
        }

        return res.status(result.error.statusCode).send(result.error.msg);
      }

      const otpData = result.res;

      //check if otp expired
      if (otpData.expiresAt < new Date()) {
        // means if current time is greater than otp expiresAt time
        return res.status(400).send("otp expired");
      }

      return res.status(200).send("OTP verified successfully");
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //reset password
  async resetPassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;

      //hashpassword
      const hashpassword = await bcrypt.hash(newPassword, 12);

      //update password
      const user = await UserModel.findOneAndUpdate(
        { email },
        { password: hashpassword },
      );

      //user not user not found
      if (!user) {
        return res.status(404).send("user not found");
      }

      // delete opt after password reset
      await this.optRepository.deleteOtp(email);

      //sending emai saying that your password is changed
      await transporter.sendMail({
        sender: process.env.EMAIL,
        to: email,
        subject: "password changed",
        text: "your password is changed",
      });
      return res.status(200).send("password reset successfull");
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
