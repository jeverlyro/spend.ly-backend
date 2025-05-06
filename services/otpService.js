const crypto = require("crypto");
const User = require("../models/User");
const emailService = require("./emailService");

class OtpService {
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOTP(userId) {
    try {
      const otp = this.generateOTP();
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 10);

      await User.findByIdAndUpdate(userId, {
        verificationCode: otp,
        verificationCodeExpires: expiration,
      });

      return otp;
    } catch (error) {
      console.error("Error creating OTP:", error);
      throw new Error("Failed to create OTP");
    }
  }

  async verifyOTP(email, otp) {
    try {
      const user = await User.findOne({
        email,
        verificationCode: otp,
        verificationCodeExpires: { $gt: new Date() },
      });

      if (!user) {
        return false;
      }

      user.isVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpires = null;
      await user.save();

      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw new Error("Failed to verify OTP");
    }
  }

  async sendVerificationEmail(user, otp) {
    try {
      await emailService.sendVerificationEmail(user.email, user.name, otp);

      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}

module.exports = new OtpService();
