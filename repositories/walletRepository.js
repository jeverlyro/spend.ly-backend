const Wallet = require("../models/wallet");

exports.getAllWallets = async () => {
  return await Wallet.find();
};

exports.createWallet = async (walletData) => {
  const wallet = new Wallet(walletData);
  return await wallet.save();
};
