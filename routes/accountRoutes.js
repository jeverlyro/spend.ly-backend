const express = require("express");
const router = express.Router();
const accountService = require("../services/accountService");

// POST route to create a new account
router.post("/", async (req, res) => {
  try {
    const accountData = req.body;
    const newAccount = await accountService.createAccount(accountData);
    res.status(201).json(newAccount);
  } catch (error) {
    console.error("Error creating account:", error.message);
    res.status(500).json({ error: "Failed to create account" });
  }
});

module.exports = router;
