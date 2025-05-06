const walletService = require("../services/walletService");

exports.getWalletData = async (req, res) => {
  try {
    const walletData = await walletService.getWalletData();
    res.status(200).json(walletData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addWalletData = async (req, res) => {
  try {
    const newWalletData = req.body;
    const result = await walletService.addWalletData(newWalletData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
