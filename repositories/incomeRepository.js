const Income = require("../models/income");

exports.getAllIncome = async () => {
  return await Income.find();
};

exports.getIncomeByUser = async (userId) => {
  return await Income.find({ userId });
};

exports.createIncome = async (incomeData) => {
  const income = new Income(incomeData);
  return await income.save();
};

exports.deleteIncome = async (id) => {
  return await Income.findByIdAndDelete(id);
};

exports.updateIncome = async (id, updatedData) => {
  return await Income.findByIdAndUpdate(id, updatedData, { new: true });
};
