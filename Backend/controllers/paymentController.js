// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// require('dotenv').config();

// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// exports.createPayment = async (req, res) => {
//   const { amount } = req.body;
//   const options = {
//     amount: amount * 100, // Amount in paise
//     currency: 'INR',
//     receipt: crypto.randomBytes(10).toString('hex'),
//   };

//   try {
//     const order = await instance.orders.create(options);
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: 'Payment creation failed' });
//   }
// };

// exports.verifyPayment = (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//   const body = razorpay_order_id + '|' + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_SECRET)
//     .update(body)
//     .digest('hex');

//   if (expectedSignature === razorpay_signature) {
//     res.status(200).json({ message: 'Payment successful' });
//   } else {
//     res.status(400).json({ message: 'Payment verification failed' });
//   }
// };
































const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createPayment = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    receipt: crypto.randomBytes(10).toString('hex'),
  };

  try {
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Payment creation failed' });
  }
};

exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ message: 'Payment successful' });
  } else {
    res.status(400).json({ message: 'Payment verification failed' });
  }
};
