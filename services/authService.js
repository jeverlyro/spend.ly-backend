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
      const existingUser = await userRepository.findUserByEmail(userData.email);

      if (existingUser) {
        throw new Error("Email sudah terdaftar");
      }

      const user = await userRepository.createUser({
        ...userData,
        isVerified: false,
      });

      return {
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

  async validateCredentials(email, password) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Email atau kata sandi tidak valid");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error("Email atau kata sandi tidak valid");
    }

    return user;
  }

  async loginUser(email, password) {
    try {
      const user = await this.validateCredentials(email, password);

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

  async googleLogin(profile) {
    try {
      let user = await userRepository.findUserByGoogleId(profile.id);

      if (!user) {
        user = await userRepository.findUserByEmail(profile.emails[0].value);

        if (user) {
          user.googleId = profile.id;
          if (profile.photos && profile.photos.length > 0) {
            user.photo = profile.photos[0].value;
          }
          user.isVerified = true;
          user = await userRepository.updateUser(user._id, user);
        } else {
          user = await userRepository.createUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos?.[0]?.value,
            googleId: profile.id,
            password: Math.random().toString(36).slice(-10),
            isVerified: true,
          });
        }
      }

      const token = this.generateToken(user._id);

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo || "",
        },
      };
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }
}

module.exports = new AuthService();
