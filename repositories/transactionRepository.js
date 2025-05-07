const Transaction = require("../models/transaction");

class TransactionRepository {
  async getAllTransactionsByUser(userId) {
    return await Transaction.find({ userId }).sort({ date: -1 });
  }

  async getTransactionById(id, userId) {
    return await Transaction.findOne({ _id: id, userId });
  }

  async createTransaction(transactionData) {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async updateTransaction(id, userId, updates) {
    return await Transaction.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
    });
  }

  async deleteTransaction(id, userId) {
    return await Transaction.findOneAndDelete({ _id: id, userId });
  }
}

module.exports = new TransactionRepository();
