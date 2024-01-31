// transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');


// POST /api/transactions
router.post('/', transactionController.addTransaction);

// GET /api/transactions
router.get('/', transactionController.getTransactions);

// PUT /api/transactions/:id
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
