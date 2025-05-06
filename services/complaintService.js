const complaintRepository = require("../repositories/complaintRepository");

exports.getComplaintData = async () => {
  return await complaintRepository.getAllComplaints();
};

exports.getUserComplaints = async (userId) => {
  return await complaintRepository.getComplaintsByUser(userId);
};

exports.addComplaintData = async (complaintData) => {
  return await complaintRepository.createComplaint(complaintData);
};

exports.updateComplaintStatus = async (id, status) => {
  return await complaintRepository.updateComplaintStatus(id, status);
};

exports.removeComplaintData = async (id) => {
  return await complaintRepository.deleteComplaint(id);
};
