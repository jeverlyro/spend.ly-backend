const emailService = require("../services/emailService");

exports.submitSupportTicket = async (req, res) => {
  try {
    const { subject, message, category } = req.body;

    // Basic validation
    if (!subject || !message || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject, message, and category",
      });
    }

    // Get user information from authenticated request if available
    const email = req.user ? req.user.email : null;
    const name = req.user ? req.user.name : null;

    // Send the support ticket email
    const result = await emailService.sendSupportTicket({
      subject,
      message,
      category,
      email,
      name,
    });

    return res.status(200).json({
      success: true,
      message: "Support ticket submitted successfully",
      result,
    });
  } catch (error) {
    console.error("Error submitting support ticket:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit support ticket",
    });
  }
};
