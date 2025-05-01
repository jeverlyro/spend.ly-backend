const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Giro", "Tabungan", "Kredit", "Investasi", "Lainnya"],
  },
  balance: { type: Number, required: true },
  icon: { type: String },
  color: { type: String },
});

module.exports = mongoose.model("Account", accountSchema);
