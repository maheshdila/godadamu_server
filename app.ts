import express, { Request,Response,NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";"cookie-parser";
require("dotenv").config();
import {ErrorMiddleware} from "./middleware/error";   //importing error middleware

import userRouter from "./routes/user.routes";


//body parser
app.use(express.json({limit:"50mb"}));

//cookie parser
app.use(cookieParser());

//cors = cross origin resources
//app.use(cors({
//    origin:process.env.ORIGIN}));

app.use(cors({
    origin:"http://54.85.143.232"}));
    

//http://54.163.49.59    
app.use("/api/v1", userRouter);

//testing api
app.get("/api/v1/test", (req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        success:true,
        message:"API Working"
    })
})    

app.all("*", (req:Request,res:Response,next:NextFunction)=>{
    const err:any = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

app.use(ErrorMiddleware);    //error middleware

