const express=require("express")
const router=express.Router()

const { createCategory, showAllCategories, categoryPageDetails } = require("../controllers/categoryController")
const {auth}=require("../middlewares/auth")

// Category can only be created by Admin
router.post("/createCategory",auth,isAdmin,createCategory)
router.post("/showAllCategories",showAllCategories)
router.post("/getCategoryPageDetails",categoryPageDetails)

// Export the router for use in the main application
module.exports=router