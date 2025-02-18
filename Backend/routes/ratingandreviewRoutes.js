const express=require("express")
const router=express.Router()

const {auth, isBuyer}=require("../middlewares/auth")

// Rating and Review
router.post("/createRating",auth,isBuyer,createRating)
router.get("/getAverageRating",getAverageRating)
router.get("/getReviews",getAllRating)

// Export the router for use in the main application
module.exports=router