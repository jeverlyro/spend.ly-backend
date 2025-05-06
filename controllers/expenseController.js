const expenseService = require("../services/expenseService");

exports.getExpenseData = async (req, res) => {
  try {
    const data = await expenseService.getExpenseData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addExpenseData = async (req, res) => {
  try {
    const newData = req.body;
    const result = await expenseService.addExpenseData(newData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateExpenseData = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await expenseService.updateExpenseData(id, updatedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeExpenseData = async (req, res) => {
  try {
    const { id } = req.params;
    await expenseService.removeExpenseData(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
