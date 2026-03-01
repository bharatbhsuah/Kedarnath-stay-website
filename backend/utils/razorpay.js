const Razorpay = require('razorpay');
require('dotenv').config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

function createOrder(amountInRupees, receiptId) {
  const options = {
    amount: Math.round(amountInRupees * 100),
    currency: 'INR',
    receipt: receiptId,
    payment_capture: 1
  };
  return instance.orders.create(options);
}

module.exports = {
  razorpay: instance,
  createOrder
};

