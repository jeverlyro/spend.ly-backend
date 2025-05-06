const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletControler");

router.get("/accounts", (req, res) => {
  console.log("GET /accounts called");
  res.status(200).json({ accounts: ["Account1", "Account2"] });
});
router.post("/", walletController.addWalletData);

module.exports = router;
