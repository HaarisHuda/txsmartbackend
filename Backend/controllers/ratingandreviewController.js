const RatingAndReview=require("../models/ratingandreview");
const Course=require("../models/Course");
const { mongoose } = require("mongoose");

// createRating
exports.createRating=async(req,res)=>{
    try{
        // get user id
        const userId=req.user.id;

        // fetch data from req body
        const {rating,review,productId}=req.body;

        // check if user already reviewed the product
        const alreadyReviewed=await RatingAndReview.findOne({
            user:userId,
            product:productId,
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Product is already reviewed by the user",
            })
        }

        // create rating and review
        const ratingReview=await RatingAndReview.create({
            rating,review,product:productId,user:userId,
        })

        // update product with this rating/review
        const updatedProductDetails=await Course.findByIdAndUpdate(
            {_id:productId},
            {
                $push:{
                    ratingAndReviews:ratingReview._id,
                }
            },
            {new:true}
        )
        console.log(updatedProductDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successfully",
            ratingReview,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// getAverageRating
exports.getAverageRating=async(req,res)=>{
    try{
        // get product id
        const productId=req.body.productId;

        // calculate the avg rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    product:new mongoose.Types.ObjectId(productId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])

        // return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        // if no rating/review exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no ratings given till now",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



// getAllRating
exports.getAllRating=async(req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({})
            .sort({rating:"desc"})
            .populate({
                path:"user",
                select:"firstName lastName email image"
            })
            // .populate({
            //     path:"product",
            //     select:"productName",
            // })
            .exec();

        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}