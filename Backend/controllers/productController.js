const Product=require("../models/product");
const Category=require("../models/category");
const User=require("../models/user");


// createProduct handler function
exports.createProduct=async(req,res)=>{
  try{
      // fetch data
      const{productName,productDescription,price,category}=req.body;

      // get thumbnail
      const thumbnail=req.files.thumbnailImage;

      // validation
      if(!productName||!productDescription||!price||!category||!thumbnail){
          return res.status(400).json({
              success:false,
              message:'All fields are required',
          })
      }

      // check for seller
      const userId=req.user.id;
      console.log("User Id",userId)
      const sellerDetails=await User.findById(userId,{
          accountType:"Seller",
      });
      console.log("Seller Details: ",sellerDetails);

      if(!sellerDetails){
          return res.status(400).json({
              success:false,
              message:'Seller details not found',
          })
      }

      // check given category is valid or not
      const categoryDetails=await Category.findById({_id:category})
      if(!categoryDetails){
          return res.status(400).json({
              success:false,
              message:'Category details not found',
          })
      }
      
      // upload image to cloudinary
      const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

      // create an entry for new course
      const newProduct=await Product.create({
          productName,
          productDescription,
          seller:sellerDetails._id,
          price,
          category:categoryDetails._id,
          thumbnail:thumbnailImage.secure_url,
      })

      
      // add the new course to user schema of seller
      const updatedUser=await User.findByIdAndUpdate(
          {_id:sellerDetails._id},
          {
              $push:{
                  products:newProduct._id,
              }
          },
          {new:true},
          ).populate("products")
          
      // update category schema
      const updatedCategory=await Category.findByIdAndUpdate(
          {_id:category},
          {
              $push:{
                  products:newProduct._id,
              }
          },
          {new:true},
      ).populate("products")


      // return response
      return res.status(200).json({
          success:true,
          message:'Product created successfully',
          data:newProduct
      })

  }catch(error){
      console.error(error);
      return res.status(500).json({
          success:false,
          message:'Failed to create course',
          error:error.message,
      })
  }

}


exports.editProduct=async(req,res)=>{
  try{
      // fetch data
      const {productId}=req.body;
      const updates=req.body;

      const product=await Product.findById(productId)

      // validation
      if(!product){
          return res.status(400).json({
              success:false,
              message:'Product not found',
          })
      }

      // If thumbnail image is found,update it
      if(req.files){
          console.log("Thumbnail updated")
          const thumbnail=req.files.thumbnailImage;
          const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
          product.thumbnail=thumbnailImage.secure_url
      }

      // update only the fields that are present in request body
      for(const key in updates){
        if(updates.hasOwnProperty(key)){
          course[key]=updates[key]
        }
      }

      await product.save()
          
      const updatedProduct=await Product.findOne(
          {_id:productId},
      ).populate({
          path:"seller",
          populate:{
              path:"additionalDetails",
          },
      })
      .populate("category")
      // .populate("ratingAndReviews")
      .exec();


      // return response
      return res.status(200).json({
          success:true,
          message:'Product updated successfully',
          data:updatedProduct
      })

  }catch(error){
      console.error(error);
      return res.status(500).json({
          success:false,
          message:'Failed to update product',
          error:error.message,
      })
  }

}


// getAllProducts handler function
exports.getAllProducts=async(req,res)=>{
  try{
      const allProducts=await Product.find({},
          {productName:true,
          price:true,
          thumbnail:true,
          seller:true,
          ratingAndReviews:true,
          buyers:true})
          .populate(
              {
                  path:"seller",
                  populate:{
                      path:"additionalDetails",
                  }
              }
          )
          .populate("category")
          .populate("buyers")
          // .strict("ratingAndReviews")
          .exec();
      
      // return response
      return res.status(200).json({
          success:true,
          message:"Data for all products fetched successfully",
          data:allProducts,
      })
  }catch(error){
      console.log(error);
      return res.status(500).json({
          success:false,
          message:"Cannot fetch product data",
          error:error.message,
      })
  }
}


exports.getFullProductDetails=async(req,res)=>{
  try{
      const {productId}=req.body
      console.log("full product details backend",productId)
      const userId=req.user.id
      const productDetails=await Product.findOne({_id:productId})
          .populate(
              {
                  path:"seller",
                  populate:{
                      path:"additionalDetails",
                  }
              }
          )
          .populate("category")
          // .strict("ratingAndReviews")
          .exec();

      if(!productDetails){
          return res.status(400).json({
              success:false,
              message:`Could not find product with id: ${productId}`,
          })
      }

      // return response
      return res.status(200).json({
          success:true,
          message:"Product details fetched successfully",
          data:{
              productDetails,
          },
      })
  }catch(error){
      console.log(error);
      return res.status(500).json({
          success:false,
          error:error.message,
      })
  }
}


exports.deleteProduct=async(req,res)=>{
  try{
      const {productId}=req.body;
      if(!productId){
          return res.status(400).json({
              success:false,
              message:"Product not found"
          })
      }
      await User.findOneAndUpdate(
          {},
          {$pull:{products:productId}},
          {new:true}
      )

      await Category.findOneAndUpdate(
          {},
          {$pull:{products:productId}},
          {new:true}
      )
      
      await Product.findByIdAndDelete({_id:productId})
      return res.status(200).json({
          success:true,
          message:"Product deleted successfully"
      })
  }catch(error){
      return res.status(500).json({
          success:false,
          message:"Failed to delete the product",
          error:error.message
      })
  }
}