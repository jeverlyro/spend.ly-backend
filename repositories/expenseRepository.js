const Expense = require("../models/expense");

exports.getAllExpenses = async () => {
  return await Expense.find();
};

exports.getExpensesByUser = async (userId) => {
  return await Expense.find({ userId });
};

exports.createExpense = async (expenseData) => {
  const expense = new Expense(expenseData);
  return await expense.save();
};

exports.deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};

exports.updateExpense = async (id, updatedData) => {
  return await Expense.findByIdAndUpdate(id, updatedData, { new: true });
};
