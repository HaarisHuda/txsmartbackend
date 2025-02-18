const jwt=require('jsonwebtoken');
require('dotenv').config();
const User=require('../models/user');

// auth
exports.auth=async(req,res,next)=>{
    try{
        // extract token
        const token=req.cookies.token||req.body.token||req.header("Authorization").replace("Bearer ","");

        // if token missing,then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            })
        }

        // verify the token
        try{
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }catch(err){
            // verification issue
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            })
        }
        next();
    }catch(error){
        // verification issue
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        })
    }
}

exports.isBuyer=async(req,res,next)=>{
    try{
        if(req.user.accountType!="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for buyers only",
            }) 
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified,please try again',
        })
    }
}

exports.isSeller=async(req,res,next)=>{
    try{
        if(req.user.accountType!="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for sellers only",
            }) 
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified,please try again',
        })
    }
}

//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin only",
            }) 
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified,please try again',
        })
    }
}