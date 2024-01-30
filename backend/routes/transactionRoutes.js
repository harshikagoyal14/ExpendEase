const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// POST /api/transactions
router.post('/', transactionController.addTransaction);

// PUT /api/transactions/:id
router.put('/:id', transactionController.updateTransaction);

module.exports = router;
