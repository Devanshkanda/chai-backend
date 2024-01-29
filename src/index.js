// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import express  from "express";
import connectDB from "./db/index.js";


dotenv.config({
    path: './env'
})

connectDB()









/*
;( async () => {

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", () => {
            console.log("ERROR", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`APP is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()

*/