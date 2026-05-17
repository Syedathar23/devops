    import express from "express";
    import multer from "multer";
    import asyncHandler from "express-async-handler";
    import { v2 as cloudinary } from "cloudinary";
    import 'dotenv/config';
    
    cloudinary.config({
        cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.APP_CLOUDINARY_API_KEY,
        api_secret: process.env.APP_CLOUDINARY_SECRET_KEY, 
    });

    export const uploadMultipleCouldinary=asyncHandler(async(req,res,next)=>{
        try {
            const images=req.files;
            const imageUrls = [];
            for(const image of images){
                const result = await cloudinary.uploader.upload(image.path,{
                    resource_type:'auto',
                })
                imageUrls.push(result.secure_url);
            }
            req.images =imageUrls;
            console.log(imageUrls);
            next();
        } catch (error) {
            return res.status(403).json({
            success: false,
            message: error.message,
        });
        }
    });