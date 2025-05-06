const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/resend-otp", authController.resendOtp);
router.post("/verify-email", authController.verifyEmail);

router.get("/verify", protect, authController.verifyToken);
router.put("/profile", protect, authController.updateProfile);

module.exports = router;
