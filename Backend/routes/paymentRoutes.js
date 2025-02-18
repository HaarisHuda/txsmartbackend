const express = require('express');
const { createPayment, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/payment', createPayment);
router.post('/verify-payment', verifyPayment);

module.exports = router;
