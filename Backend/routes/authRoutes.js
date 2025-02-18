const express=require("express")
const router=express.Router()

const{
    signup, 
    verifyOTP,
    resendOTP,
    login,
    changePassword,
}=require("../controllers/AuthController")

const{
    resetPasswordToken,
    resetPassword,
}=require("../controllers/resetpasswordController")

const {auth}=require("../middlewares/auth")

// Routes for login,signup and authentication

// Authentication routes

// Route for user login
router.post("/login",login)

// Route for user signup
router.post("/signup",signup)

// Route for changing the password
router.post("/changepassword",auth,changePassword)


// Reset Password

// Route for generating a reset password token
router.post("/reset-password-token",resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password",resetPassword)

// Export the router for use in the main application
module.exports=router