import { NextFunction,Request,Response } from "express";

export const catchAsyncErrors = (fn:Function)=>{ 
    return (req:Request, res:Response, next:NextFunction)=>{
        Promise.resolve(fn(req,res,next)).catch(next);
    }
}