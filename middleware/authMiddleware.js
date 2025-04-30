const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and has the Bearer format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await userRepository.findUserById(decoded.id);

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Tidak terotentikasi" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "Tidak terotentikasi, token tidak ditemukan" });
  }
};

module.exports = { protect };
