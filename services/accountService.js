const Account = require("../models/accountModel");

// Function to create a new account
const createAccount = async (accountData) => {
  try {
    const newAccount = new Account(accountData);
    await newAccount.save();
    return newAccount;
  } catch (error) {
    throw new Error("Error creating account: " + error.message);
  }
};

// Function to get all accounts
const getAllAccounts = async () => {
  try {
    return await Account.find();
  } catch (error) {
    throw new Error("Error fetching accounts: " + error.message);
  }
};

// Function to get an account by ID
const getAccountById = async (accountId) => {
  try {
    return await Account.findById(accountId);
  } catch (error) {
    throw new Error("Error fetching account: " + error.message);
  }
};

// Function to update an account
const updateAccount = async (accountId, updateData) => {
  try {
    return await Account.findByIdAndUpdate(accountId, updateData, {
      new: true,
    });
  } catch (error) {
    throw new Error("Error updating account: " + error.message);
  }
};

// Function to delete an account
const deleteAccount = async (accountId) => {
  try {
    return await Account.findByIdAndDelete(accountId);
  } catch (error) {
    throw new Error("Error deleting account: " + error.message);
  }
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
