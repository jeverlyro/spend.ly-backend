const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");

// Support ticket submission route - no authentication required so users can
// submit support tickets even if they're not logged in
router.post("/submit", supportController.submitSupportTicket);

module.exports = router;
