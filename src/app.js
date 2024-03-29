import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express()

// app.use is used for all middlewares or configurations
app.use(cors({
    origin: process.env.CORS_ORIGIN, // KON KON SA ORIGIN HUM ALLOW KR RAHE HAI
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes

import userRouter from './routes/user.routes.js';


// router declaretaion
app.use("/api/v1/users", userRouter)


export { app }