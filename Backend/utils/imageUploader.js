const cloudinary=require('cloudinary').v2

exports.uploadImageToCloudinary=async(file,folder,height,quality)=>{
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.deleteImageFromCloudinary=async(file,folder)=>{
    const options={folder};
    
    options.resource_type="auto";

    return await cloudinary.uploader.explicit(file.tempFilePath,options);
}