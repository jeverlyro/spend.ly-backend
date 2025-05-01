const express = require("express");
const router = express.Router();
const accountRoutes = require("./accountRoutes");

// Example route
router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Use account routes
router.use("/accounts", accountRoutes);

module.exports = router;
