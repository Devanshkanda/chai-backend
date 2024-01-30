import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {

    try {
        console.log("\n Before creating connection\n")
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log("\n Aftercreating connection\n")

        console.log(`\n Mongodb connected !! DB host: 
        ${connectionInstance.connection.host}\n`);
    } catch (error) {
        console.log("MONGODB connection Failed: ", error);
        process.exit(1)
    }

}


export default connectDB