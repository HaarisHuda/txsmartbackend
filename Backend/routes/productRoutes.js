const express = require('express');
const { isSeller, auth } = require('../middlewares/auth');
const { getAllProducts, getFullProductDetails, editProduct, deleteProduct, createProduct } = require('../controllers/productController');

const router = express.Router();

// Product routes

// Product can only be created by Sellers
router.post("/createCourse",auth,isSeller,createProduct)

// get all products
router.get("/getAllProducts",getAllProducts)

// get details for a specific courses
router.post("/getProductDetails",getFullProductDetails)   

router.put("/editCourse",auth,isSeller,editProduct)

router.post("/getFullProductDetails",auth,getFullProductDetails)

router.delete("/deleteProduct",deleteProduct)

module.exports = router;