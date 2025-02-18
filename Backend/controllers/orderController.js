// const Order = require('../models/order');
// const nodemailer = require('nodemailer');

// exports.createOrder = async (req, res) => {
//   const { userName, email, address, products, totalAmount } = req.body;
//   try {
//     const newOrder = new Order({ userName, email, address, products, totalAmount });
//     await newOrder.save();

//     // Send email to the seller
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER, // Seller's email
//       subject: 'New Order Received',
//       text: `You have received a new order of amount ₹${totalAmount}.`,
//     };

//     transporter.sendMail(mailOptions);

//     res.status(201).json(newOrder);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create order' });
//   }
// };




























const Order = require('../models/order');
const nodemailer = require('nodemailer');

exports.createOrder = async (req, res) => {
  const { userName, email, address, products, totalAmount } = req.body;

  try {
    const newOrder = new Order({ userName, email, address, products, totalAmount });
    await newOrder.save();

    // Send email to the seller (you need to configure your email service properly)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,  // Seller's email
      subject: 'New Order Received',
      text: `New order received. Total: ₹${totalAmount}`,
    };

    transporter.sendMail(mailOptions);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};
