const express = require("express");
const router = express.Router();
const incomeController = require("../controllers/incomeController");

// GET semua data income
router.get("/", incomeController.getIncomeData);

// POST tambah data income
router.post("/", incomeController.addIncomeData);

// (Opsional) Tambahan jika dibutuhkan:
// GET berdasarkan ID
router.get("/:id", incomeController.getIncomeById);

// PUT update data income
router.put("/:id", incomeController.updateIncomeData);

// DELETE hapus data income
router.delete("/:id", incomeController.deleteIncomeData);

module.exports = router;
