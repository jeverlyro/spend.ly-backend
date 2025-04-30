const authService = require("../services/authService");
const userRepository = require("../repositories/userRepository");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua bidang harus diisi" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Kata sandi minimal 8 karakter" });
      }

      const result = await authService.registerUser({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Registrasi gagal" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email dan kata sandi diperlukan" });
      }

      const result = await authService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ message: error.message || "Otentikasi gagal" });
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
}

module.exports = new AuthController();
