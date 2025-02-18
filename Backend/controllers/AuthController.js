const User=require("../models/user");
const OTP=require("../models/otp");
const otpGenerator=require('otp-generator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const mailSender=require("../utils/mailSender");
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
const Profile=require("../models/profile"); 
const nodemailer = require("nodemailer");
require('dotenv').config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer setup for sending OTP emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

// signup function 
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, phoneNumber } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already registered" });
        }

        // Generate OTP and store it
        const otp = generateOTP();
        await OTP.create({ email, otp });

        // Send OTP via Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Signup",
            text: `Your OTP for account verification is: ${otp}`,
        };
        await transporter.sendMail(mailOptions);

        // Store user data temporarily (not activated yet)
        const tempUser = {
            firstName,
            lastName,
            email,
            password, // Will be hashed after OTP verification
        };

        res.status(200).json({
            success: true,
            message: "OTP sent successfully. Please verify to complete signup.",
            tempUser, // Send temp user details for reference
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Signup failed, please try again" });
    }
};

// OTP Verification 
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp, tempUser } = req.body;

        // Validate request
        if (!email || !otp || !tempUser) {
            return res.status(400).json({ success: false, message: "Email, OTP, and user details are required" });
        }

        // Find the most recent OTP for the user
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (response.length === 0 || response[0].otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(tempUser.password, 10);

        // Create Profile
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create user in DB
        const user = await User.create({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            phoneNumber: tempUser.phoneNumber,
            password: hashedPassword,
            accountType: "Buyer", // Hardcoded as "Buyer"
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${tempUser.firstName} ${tempUser.lastName}`,
        });

        res.status(200).json({ success: true, message: "User registered successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "OTP verification failed" });
    }
};

// resend-otp 
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate request
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate new OTP
        const otp = generateOTP();  // Function to generate a 6-digit OTP
        await OTP.create({ email, otp });

        // Send OTP via Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Signup",
            text: `Your OTP for account verification is: ${otp}`,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "New OTP sent successfully. Please verify.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to resend OTP, please try again" });
    }
};

// login
exports.login=async(req,res)=>{

    try{
        // fetch data from request ki body
        const{email,password}=req.body;

        // validate krlo
        if(!email||!password){
                return res.status(403).json({
                    success:false,
                    message:"All fields are required",
                })
        }

        // check if user already exist
        const user=await User.findOne({email}).populate("additionalDetails");

        // if user already exist,then return a response
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User is not registered,please signup',
            })
        }

        // generate JWT,after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token=token;
            user.password=undefined;

            // create cookie and send response
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully",
            })
        }
        else{
           return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure,please try again",
        })
    }
}


// changePassword
exports.changePassword=async(req,res)=>{
    try{
        const userId=req.user.id
        const{oldPassword,newPassword}=req.body;
        const user=await User.findById(userId)
        
        console.log("old password",oldPassword)
        console.log("db password",user.password)

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(! await bcrypt.compare(oldPassword,user.password)){
            return res.status(401).json({
                success:false,
                message:"Password do not match"
            })
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);

        const updatedUserDetails=await User.findByIdAndUpdate(
            {_id:userId},
            {password:hashedPassword},
            {new:true}
        )

        res.status(200).json({
            success:true,
            message:updatedUserDetails,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed to change password"
        })
    }
}


exports.appsignup = async (req, res) => {
    try {
        // Fetch data from request body
        console.log("Backend pe aa gaya")
        const { firstName, lastName, email, password, confirmPassword, accountType } = req.body;

        // Validate inputs
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Password match check
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword do not match, please try again",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        // If user already exists, return a response
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile details
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        // Create user in the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return success response
        res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again",
        });
    }
};
