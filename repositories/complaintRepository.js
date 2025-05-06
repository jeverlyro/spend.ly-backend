const Complaint = require("../models/complaint");

exports.getAllComplaints = async () => {
  return await Complaint.find();
};

exports.getComplaintsByUser = async (userId) => {
  return await Complaint.find({ userId });
};

exports.createComplaint = async (complaintData) => {
  const complaint = new Complaint(complaintData);
  return await complaint.save();
};

exports.updateComplaintStatus = async (id, status) => {
  return await Complaint.findByIdAndUpdate(id, { status }, { new: true });
};

exports.deleteComplaint = async (id) => {
  return await Complaint.findByIdAndDelete(id);
};
