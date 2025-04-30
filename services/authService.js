const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findUserByEmail(userData.email);

      if (existingUser) {
        throw new Error("Email sudah terdaftar");
      }

      // Create new user
      const user = await userRepository.createUser(userData);

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      // Find user
      const user = await userRepository.findUserByEmail(email);

      if (!user) {
        throw new Error("Email atau kata sandi tidak valid");
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw new Error("Email atau kata sandi tidak valid");
      }

      // Generate token
      const token = this.generateToken(user._id);

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await userRepository.findUserById(userId);

      if (!user) {
        throw new Error("User tidak ditemukan");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
