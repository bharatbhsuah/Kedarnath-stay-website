const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentByBooking
} = require('../controllers/payment.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/create-order', verifyToken, createPaymentOrder);
router.post('/verify', verifyToken, verifyPayment);
router.get('/booking/:bookingId', verifyToken, getPaymentByBooking);

module.exports = router;

