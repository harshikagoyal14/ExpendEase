const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionType: { type: String, required: true },
  category: { type: String },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  userEmail: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
