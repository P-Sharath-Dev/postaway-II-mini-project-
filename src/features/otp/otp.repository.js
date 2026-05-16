// Add valid EMAIL and PASSWORD in .env for OTP email functionality
// Add valid EMAIL and PASSWORD in .env for OTP email functionality
// Add valid EMAIL and PASSWORD in .env for OTP email functionality
// Example:

// EMAIL=your_email
// PASSWORD=your_app_password

import OtpModel from "./otp.schema.js";
export default class OptRepository {
  //save otp
  async saveOtp(email, otp) {
    try {
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      const newOtp = new OtpModel({
        email,
        otp,
        expiresAt,
      });

      await newOtp.save();

      return {
        success: true,
        res: newOtp,
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

  //no.of attemps - wrong otp
  async increaseAttempts(email) {
    try {
      const otpDocument = await OtpModel.findOneAndUpdate(
        { email },
        {
          $inc: {
            attempts: 1,
          },
        },
        { returnDocument: "after" },
      );

      // if (!otpDoc) {
      //   return {
      //     success: false,
      //     error: {
      //       statusCode: 404,
      //       msg: "otp not found",
      //     },
      //   };
      // }
      return {
        success: true,
        res: otpDocument,
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

  //find otp
  async findOtp(email, otp) {
    try {
      const otpFound = await OtpModel.findOne({
        email,
        otp,
      });

      //otp not found
      if (!otpFound) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "Invalid OTP",
          },
        };
      }

      return {
        success: true,
        res: otpFound,
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

  //delete otp after password reset
  async deleteOtp(email) {
    try {
      await OtpModel.deleteMany({ email });
      return {
        success: true,
        res: "otp deleted",
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
