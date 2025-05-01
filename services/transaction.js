const express = require("express");
const Transaction = require("../models/transactionModel");
const router = express.Router();

// Endpoint untuk menambahkan transaksi
router.post("/api/transactions", async (req, res) => {
  try {
    const { amount, description } = req.body;

    // Validasi data transaksi
    if (!amount || !description) {
      return res.status(400).json({ error: "Data transaksi tidak lengkap" });
    }

    // Buat transaksi baru
    const newTransaction = new Transaction({
      amount,
      description,
      date: new Date().toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    // Simpan transaksi ke database MongoDB
    const savedTransaction = await newTransaction.save();

    // Kirimkan transaksi yang baru disimpan sebagai respons
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error saat menambahkan transaksi:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
