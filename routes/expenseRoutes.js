const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

// GET semua data expense
router.get("/", expenseController.getExpenseData);

// POST tambah data expense
router.post("/", expenseController.addExpenseData);

// (Opsional) Tambahan jika dibutuhkan:
// GET berdasarkan ID
router.get("/:id", expenseController.getExpenseById);

// PUT update data expense
router.put("/:id", expenseController.updateExpenseData);

// DELETE hapus data expense
router.delete("/:id", expenseController.deleteExpenseData);

module.exports = router;
