const expenseRepository = require("../repositories/expenseRepository");

exports.getExpenseData = async () => {
  return await expenseRepository.getAllExpenses();
};

exports.getUserExpenses = async (userId) => {
  return await expenseRepository.getExpensesByUser(userId);
};

exports.addExpenseData = async (expenseData) => {
  return await expenseRepository.createExpense(expenseData);
};

exports.updateExpenseData = async (id, updatedData) => {
  return await expenseRepository.updateExpense(id, updatedData);
};

exports.removeExpenseData = async (id) => {
  return await expenseRepository.deleteExpense(id);
};
