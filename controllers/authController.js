const authService = require("../services/authService");
const userRepository = require("../repositories/userRepository");
const otpService = require("../services/otpService");
const emailService = require("../services/emailService");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua bidang harus diisi" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Kata sandi minimal 8 karakter" });
      }

      const result = await authService.registerUser({ name, email, password });

      const otp = await otpService.createOTP(result.user.id);
      await otpService.sendVerificationEmail(result.user, otp);

      res.status(201).json({
        success: true,
        message: "User registered successfully. Verification email sent.",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Registrasi gagal" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email dan kata sandi diperlukan" });
      }

      const user = await authService.validateCredentials(email, password);

      if (!user.isVerified) {
        const otp = await otpService.createOTP(user._id);
        await otpService.sendVerificationEmail(user, otp);

        return res.status(401).json({
          message:
            "Email belum diverifikasi. Kode verifikasi baru telah dikirim.",
          requiresVerification: true,
          email: user.email,
        });
      }

      const token = authService.generateToken(user._id);

      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ message: error.message || "Otentikasi gagal" });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and verification code are required",
        });
      }

      const user = await userRepository.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.verificationCode !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification code",
        });
      }

      if (user.verificationCodeExpires < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "Verification code has expired",
        });
      }

      user.isVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpires = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      console.error("Email verification error:", error);
      return res.status(500).json({
        success: false,
        message: "Email verification failed: " + error.message,
      });
    }
  }

  async resendOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await userRepository.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const otpExpiry = Date.now() + 15 * 60 * 1000;

      user.verificationCode = otp;
      user.verificationCodeExpires = otpExpiry;
      await user.save();

      await emailService.sendVerificationEmail(user.email, user.name, otp);

      return res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code: " + error.message,
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const user = await authService.getUserProfile(req.user.id);
      res.status(200).json({
        valid: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(401).json({ message: error.message || "Verifikasi gagal" });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, email, photo } = req.body;
      const updates = {};

      if (name) updates.name = name;
      if (email) updates.email = email;
      if (photo) updates.photo = photo;

      const updatedUser = await userRepository.updateUser(req.user.id, updates);

      res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res
        .status(400)
        .json({ message: error.message || "Pembaruan profil gagal" });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await userRepository.findUserByEmail(email);

      if (!user) {
        return res.status(200).json({
          success: true,
          message: "If your email exists, a reset link has been sent.",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetUrl
      );

      res.status(200).json({
        success: true,
        message: "If your email exists, a reset link has been sent.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Error sending reset email. Please try again.",
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: "Token and password are required",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Password reset token is invalid or has expired",
        });
      }

      // Simply set the password - the pre-save middleware will hash it
      user.password = password;

      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      await emailService.sendPasswordChangeConfirmationEmail(
        user.email,
        user.name
      );

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Error resetting password. Please try again.",
      });
    }
  }
}

module.exports = new AuthController();
