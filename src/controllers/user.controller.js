import { response } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async (userid) => {
    try {
        const user = await User.findById(userid);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshtoken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

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

    const existedUser = await User.findOne({
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


const loginUser = asyncHandler(async (req, res) => {
    
    // fetch username and password from the user
    // then validate whether user exists or not
    // if yes then password check . 
    // logged them in and give them access and refresh token
    // send cookies carries tokens, send secure cookies
    // else return response error code


    const {email, username, password} = req.body;

    if (!username || !email) {
        throw new ApiError(400, "username or email is required");
    }

    
    const userExists = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!userExists) {
        throw new ApiError(404, "User does not exists");
    }

    const isPassordValid = await userExists.isPasswordCorrect(password);

    if (!isPassordValid) {
        throw new ApiError(401, "Password incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(userExists._id)

    const loggedInUser = await User.findById(userExists._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged in Successfully"
    ))
})


const logoutUser = asyncHandler(async (req, res) => {

    // clear the user cookies

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}