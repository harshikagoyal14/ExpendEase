const Transaction = require('../models/transaction');

const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction added successfully' });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Error adding transaction' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndUpdate(id, req.body);
    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Error updating transaction' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
};



module.exports = {
    addTransaction,
    updateTransaction,
    getTransactions,
    deleteTransaction
};
