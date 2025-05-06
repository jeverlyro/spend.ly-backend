const transactionRepository = require("../repositories/transactionRepository");

class TransactionService {
  async getUserTransactions(userId) {
    return await transactionRepository.getAllTransactionsByUser(userId);
  }

  async getTransaction(id, userId) {
    return await transactionRepository.getTransactionById(id, userId);
  }

  async createTransaction(transactionData, userId) {
    return await transactionRepository.createTransaction({
      ...transactionData,
      userId,
    });
  }

  async updateTransaction(id, userId, updates) {
    return await transactionRepository.updateTransaction(id, userId, updates);
  }

  async deleteTransaction(id, userId) {
    return await transactionRepository.deleteTransaction(id, userId);
  }
}

module.exports = new TransactionService();
