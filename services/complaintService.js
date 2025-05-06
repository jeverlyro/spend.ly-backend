const complaintServices = require("../repositories/complaintRepository");

exports.getComplaintData = async () => {
  return await complaintServices.getAllComplaints();
};

exports.getUserComplaints = async (userId) => {
  return await complaintServices.getComplaintsByUser(userId);
};

exports.addComplaintData = async (complaintData) => {
  return await complaintServices.createComplaint(complaintData);
};

exports.updateComplaintStatus = async (id, status) => {
  return await complaintServices.updateComplaintStatus(id, status);
};

exports.removeComplaintData = async (id) => {
  return await complaintServices.deleteComplaint(id);
};
