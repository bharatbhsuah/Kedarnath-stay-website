const express = require('express');
const router = express.Router();
const { getReceipt } = require('../controllers/receipt.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/:bookingId', verifyToken, getReceipt);

module.exports = router;

