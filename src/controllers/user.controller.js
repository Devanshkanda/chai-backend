import { response } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "Chai or code"
    // })

    // step1: fetch data from the request body for user register details
    // step2: validate the data,
    // step3: check if user already exists or not
    // step4: check for images, check for avatar
    // step5: upload them to cloudinary
    // step6: create user object 
    // step3: if all info is correct then create a user and store the password
    // hashed form
    // remove password and refresh token response 
    // check for user creation
    // return res

    const {fullname, email, username, password} = req.body;
    console.log("email", email);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "user with email or username exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
        
    })

    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user");
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})


export {registerUser}