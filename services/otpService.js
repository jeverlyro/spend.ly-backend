const crypto = require("crypto");
const User = require("../models/User");
const emailService = require("./emailService");

class OtpService {
  generateOTP() {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOTP(userId) {
    try {
      const otp = this.generateOTP();
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 10); // OTP valid for 10 minutes

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

      // Mark user as verified and clear OTP
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
      // Pass parameters correctly: email, name, otp
      await emailService.sendVerificationEmail(user.email, user.name, otp);

      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}

module.exports = new OtpService();
