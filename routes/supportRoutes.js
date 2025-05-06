const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");

router.post("/submit", supportController.submitSupportTicket);

module.exports = router;
