const incomeServices = require("../repositories/incomeRepository");

exports.getIncomeData = async () => {
  return await incomeServices.getAllIncome();
};

exports.getUserIncome = async (userId) => {
  return await incomeServices.getIncomeByUser(userId);
};

exports.addIncomeData = async (incomeData) => {
  return await incomeServices.createIncome(incomeData);
};

exports.updateIncomeData = async (id, updatedData) => {
  return await incomeServices.updateIncome(id, updatedData);
};

exports.removeIncomeData = async (id) => {
  return await incomeServices.deleteIncome(id);
};
