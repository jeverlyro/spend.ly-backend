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
      await emailService.sendMail({
        to: user.email,
        subject: "Verifikasi Email Spend.ly",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0070f3; text-align: center;">Spend.ly</h2>
            <h3 style="text-align: center;">Verifikasi Email Anda</h3>
            <p>Halo ${user.name},</p>
            <p>Terima kasih telah mendaftar di Spend.ly. Untuk menyelesaikan proses pendaftaran, silakan masukkan kode verifikasi berikut:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 24px; letter-spacing: 8px; font-weight: bold; background-color: #f5f5f5; padding: 15px; border-radius: 8px; display: inline-block;">${otp}</div>
            </div>
            <p>Kode ini akan kedaluwarsa dalam 10 menit.</p>
            <p>Jika Anda tidak mendaftar di Spend.ly, silakan abaikan email ini.</p>
            <p style="margin-top: 30px; color: #718096; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Spend.ly. All rights reserved.
            </p>
          </div>
        `,
      });

      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}

module.exports = new OtpService();
