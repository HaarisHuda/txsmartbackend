// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userName: { type: String, required: true },
//   email: { type: String, required: true },
//   address: { type: String, required: true },
//   products: [{
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//     quantity: { type: Number },
//   }],
//   totalAmount: { type: Number, required: true },
//   status: { type: String, default: 'Pending' },
// });

// module.exports = mongoose.model('Order', orderSchema);















const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Order', orderSchema);
