// controllers/transactionController.js

const { model } = require('mongoose');
const Transaction = require('../models/transaction');

const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding transaction' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndUpdate(id, req.body);
    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating transaction' });
  }
};
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

module.exports = {
    addTransaction,
    updateTransaction,
    getTransactions
};
