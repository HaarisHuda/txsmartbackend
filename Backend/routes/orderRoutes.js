// const express = require('express');
// const { createOrder } = require('../controllers/orderController');
// const router = express.Router();

// router.post('/order', createOrder);

// module.exports = router;









const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

router.post('/', createOrder);

module.exports = router;
