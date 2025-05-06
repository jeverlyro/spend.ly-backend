const walletRepository = require("../repositories/walletRepository");

exports.getWalletData = async () => {
  return await walletRepository.getAllWallets();
};

exports.addWalletData = async (walletData) => {
  return await walletRepository.createWallet(walletData);
};
