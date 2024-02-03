import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs, { realpathSync } from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_KEY
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded

        console.log("file is uploaded on cloudinary : ", response.url);

        return response

    } catch (error) {
        console.log("Error occured while uploading the file: ", error);
        fs.unlinkSync(localFilePath) // remove the locally saved 
        // temporary file as the upload operation failed

        return null;
    }
}

export {uploadOnCloudinary} 