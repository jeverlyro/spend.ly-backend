const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Transaction = require("../models/transaction");

// Get all transactions for the logged-in user
router.get("/transactions", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json({ transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get a specific transaction by ID
router.get("/transactions/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json({ transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new transaction
router.post("/transactions", protect, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validate input
    if (!title || amount === undefined || !category) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    // Create new transaction
    const newTransaction = new Transaction({
      userId: req.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
    });

    const transaction = await newTransaction.save();
    res.status(201).json({
      message: "Transaksi berhasil dibuat",
      transaction,
    });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a transaction
router.put("/transactions/:id", protect, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const updates = {};

    if (title) updates.title = title;
    if (amount !== undefined) updates.amount = amount;
    if (category) updates.category = category;
    if (date) updates.date = date;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json({
      message: "Transaksi berhasil diupdate",
      transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a transaction
router.delete("/transactions/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
