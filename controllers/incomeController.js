const incomeService = require("../services/incomeService");

exports.getIncomeData = async (req, res) => {
  try {
    const data = await incomeService.getIncomeData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addIncomeData = async (req, res) => {
  try {
    const newData = req.body;
    const result = await incomeService.addIncomeData(newData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateIncomeData = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await incomeService.updateIncomeData(id, updatedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeIncomeData = async (req, res) => {
  try {
    const { id } = req.params;
    await incomeService.removeIncomeData(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
