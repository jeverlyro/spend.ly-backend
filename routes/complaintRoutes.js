const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");

// GET semua data complaint
router.get("/", complaintController.getComplaintData);

// POST tambah data complaint
router.post("/", complaintController.addComplaintData);

// (Opsional) Tambahan jika dibutuhkan:
// GET berdasarkan ID
router.get("/:id", complaintController.getComplaintById);

// PUT update data complaint
router.put("/:id", complaintController.updateComplaintData);

// DELETE hapus data complaint
router.delete("/:id", complaintController.deleteComplaintData);

module.exports = router;
