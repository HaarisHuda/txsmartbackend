const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser=require("cookie-parser");
const {cloudinaryConnect}=require("./config/cloudinary");
const {connect}=require("./config/database");
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const productRoutes = require('./routes/productRoutes');
const PORT = process.env.PORT || 5000;

dotenv.config();

connect();   

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"*",
        credentials:true,
    })
)

cloudinaryConnect();

app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', productRoutes);

app.get('/',(req,res)=>{
  return res.json({
    success:true,
    message:"Your server is up and running..."
  })
})

app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on all network interfaces');
});