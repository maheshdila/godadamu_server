import mongoose from "mongoose";
require("dotenv").config();

const dbUrl:string = process.env.MONGO_DB_URL || '';

const connectDB = async ()=>{
    try{
        await mongoose.connect(dbUrl).then((data:any)=>{
            console.log(`databse connect with ${data.connection.host}`);
        })
    }catch(error :any){
        console.log(error.message);
        setTimeout(connectDB,5000);
        
    }
}

export default connectDB;