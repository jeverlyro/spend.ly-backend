const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Wallet = require("../models/wallet");
const User = require("../models/User");

// Mendapatkan semua rekening pengguna
router.get("/accounts", protect, async (req, res) => {
  try {
    // Ubah pencarian untuk sesuai dengan model Wallet
    const accounts = await Wallet.find({ userId: req.user.id });
    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Menambahkan rekening baru
router.post("/accounts", protect, async (req, res) => {
  try {
    const { name, type, balance } = req.body;

    // Validasi input
    if (!name || !type) {
      return res
        .status(400)
        .json({ message: "Nama dan tipe rekening harus diisi" });
    }

    // Cek apakah rekening dengan nama yang sama sudah ada
    const existingAccount = await Wallet.find({
      userId: req.user.id,
      name: name,
    });

    if (existingAccount && existingAccount.length > 0) {
      return res
        .status(400)
        .json({ message: "Rekening dengan nama ini sudah ada" });
    }

    // Buat rekening baru
    const newAccount = new Wallet({
      userId: req.user.id,
      name,
      type,
      balance: balance || 0,
    });

    const account = await newAccount.save();
    res.status(201).json({
      message: "Rekening berhasil dibuat",
      account,
    });
  } catch (err) {
    console.error("Error creating account:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Mendapatkan rekening berdasarkan ID
router.get("/accounts/:id", protect, async (req, res) => {
  try {
    const account = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!account) {
      return res.status(404).json({ message: "Rekening tidak ditemukan" });
    }

    res.json({ account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update rekening
router.put("/accounts/:id", protect, async (req, res) => {
  try {
    const { name, type, balance } = req.body;
    const account = await Wallet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, type, balance },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Rekening tidak ditemukan" });
    }

    res.json({ message: "Rekening berhasil diupdate", account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Hapus rekening
router.delete("/accounts/:id", protect, async (req, res) => {
  try {
    const account = await Wallet.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!account) {
      return res.status(404).json({ message: "Rekening tidak ditemukan" });
    }

    res.json({ message: "Rekening berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
