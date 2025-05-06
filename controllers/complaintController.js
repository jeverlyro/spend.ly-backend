const complaintService = require("../services/complaintService");

exports.getComplaintData = async (req, res) => {
  try {
    const data = await complaintService.getComplaintData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComplaintData = async (req, res) => {
  try {
    const newData = req.body;
    const result = await complaintService.addComplaintData(newData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await complaintService.updateComplaintStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeComplaintData = async (req, res) => {
  try {
    const { id } = req.params;
    await complaintService.removeComplaintData(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
