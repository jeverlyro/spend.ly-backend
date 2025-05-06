const expenseService = require("../repositories/expenseRepository");

exports.getExpenseData = async () => {
  return await expenseService.getAllExpenses();
};

exports.getUserExpenses = async (userId) => {
  return await expenseService.getExpensesByUser(userId);
};

exports.addExpenseData = async (expenseData) => {
  return await expenseService.createExpense(expenseData);
};

exports.updateExpenseData = async (id, updatedData) => {
  return await expenseService.updateExpense(id, updatedData);
};

exports.removeExpenseData = async (id) => {
  return await expenseService.deleteExpense(id);
};
