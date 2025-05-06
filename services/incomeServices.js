const incomeRepository = require("../repositories/incomeRepository");

exports.getIncomeData = async () => {
  return await incomeRepository.getAllIncome();
};

exports.getUserIncome = async (userId) => {
  return await incomeRepository.getIncomeByUser(userId);
};

exports.addIncomeData = async (incomeData) => {
  return await incomeRepository.createIncome(incomeData);
};

exports.updateIncomeData = async (id, updatedData) => {
  return await incomeRepository.updateIncome(id, updatedData);
};

exports.removeIncomeData = async (id) => {
  return await incomeRepository.deleteIncome(id);
};
