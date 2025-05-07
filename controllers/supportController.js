const emailService = require("../services/emailService");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("attachment");

exports.submitSupportTicket = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "File upload error: " + err.message,
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: "Unknown error during file upload",
      });
    }

    try {
      const { subject, message, category } = req.body;

      if (!subject || !message || !category) {
        return res.status(400).json({
          success: false,
          message: "Please provide subject, message, and category",
        });
      }

      const email = req.body.email || (req.user ? req.user.email : null);
      const name = req.body.name || (req.user ? req.user.name : null);

      const attachment = req.file || null;

      await emailService.sendSupportTicket({
        subject,
        message,
        category,
        email,
        name,
        attachment,
      });

      return res.status(200).json({
        success: true,
        message: "Support ticket submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit support ticket: " + error.message,
      });
    }
  });
};
