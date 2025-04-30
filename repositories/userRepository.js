const User = require("../models/User");

class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id).select("-password");
  }

  async updateUser(id, updates) {
    return await User.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select("-password");
  }
}

module.exports = new UserRepository();
