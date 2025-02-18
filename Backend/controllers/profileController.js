const { cloudinaryConnect } = require("../config/cloudinary");
const Profile=require("../models/profile");
const User=require("../models/user");
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require("../utils/imageUploader");

exports.updateProfile=async(req,res)=>{
    try{
        // get data
        const{dateOfBirth="",about="",contactNumber,gender}=req.body;

        // get userId
        const id=req.user.id;

        // validation
        if(!contactNumber||!gender||!id){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        // find profile
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);

        // update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        console.log(profileDetails)
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success:true,
            message:'Profile updated successfully',
            data:profileDetails,
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to update profile',
            error:error.message,
        })
    }
}


// delete account
exports.deleteAccount=async(req,res)=>{
    try{
        // get id
        const id=req.user.id;

        // validation
        const userDetails=await User.findById({_id:id});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found',
            })
        }

        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // delete user
        await User.findByIdAndDelete({_id:id});

        // return response
        return res.status(200).json({
            success:true,
            message:'User account deleted successfully',
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete user account',
            error:error.message,
        })
    }
}


exports.getAllUserDetails=async(req,res)=>{
    try{
        // get id
        const id=req.user.id;
        console.log(id)

        // validation
        const userDetails=await User.findById({_id:id})
        .populate("additionalDetails")
        .populate("courses")
        // .populate("studentsEnrolled")
        .exec();
        
        // return response
        return res.status(200).json({
            success:true,
            data:userDetails,
            message:'User data fetched successfully',
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to fetch user data',
            error:error.message,
        })
    }
}

exports.updateDisplayPicture=async(req,res)=>{
    try{
        const userId=req.user.id;
        console.log(userId)
        const userDetails=await User.findById({_id:userId});
        console.log(userDetails)
        const oldurl=userDetails.image;
        console.log(oldurl)
        // await deleteImageFromCloudinary(oldurl,process.env.FOLDER_NAME);
        const updatedImage=req.files.displayPicture;
        console.log(updatedImage)
        const uploadDetails=await uploadImageToCloudinary(updatedImage,process.env.FOLDER_NAME);
        console.log(uploadDetails.secure_url)
        const updatedProfile=await User.findByIdAndUpdate(
            {_id:userId},
            {
                image:uploadDetails.secure_url,
            },
            {new:true}
        )
        res.status(200).json({
            success:true,
            data:updatedProfile
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Profile picture can not be updated"
        })
    }
}
