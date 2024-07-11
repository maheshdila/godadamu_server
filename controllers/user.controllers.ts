import { Request,Response,NextFunction } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import  {catchAsyncErrors}  from "../middleware/catchAsyncErrors";
import jwt,{Secret} from "jsonwebtoken";
import ejs from "ejs";
import { send } from "process";
import sendMail from "../utils/sendMails";
import path from "path";

//register user

interface IRegistrationBody{
    name:string;
    email:string;
    password:string;
    avatar?:string;
}

export const registrationUser = catchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {name,email,password,avatar}:IRegistrationBody = req.body;
        console.log(req.body);
        
        const isEmailExist = await userModel.findOne({email})
        if(isEmailExist){
            return next(new ErrorHandler("Email already exists",400));
        }

        const user:IRegistrationBody = {
            name,
            email,
            password,
        }
        const activationToken = createActivationToken(user);
        
        const activationCode = activationToken.activationCode;

        const data  = {user:user.name,activationCode};

        const html = await ejs.renderFile(
            path.join(__dirname, "../mails/activation-mail.ejs"),
            data
          );
        try{
            await sendMail({
                email:user.email,
                subject:"Account Activation",
                template : "activation-mail.ejs",
                data
            });
            res.status(200).json({
                success:true,
                message:`Please check your email ${user.email} to activate your account!`,
                activationToken:activationToken.token
            });


        }catch(err:any){
            return next(new ErrorHandler(err.message,400));
        }

    }catch(err:any){
        next(new ErrorHandler(err.message,400));
    }
});
interface IActivationToken{
    token:string;
    activationCode:string;
}

export const createActivationToken = (user:any):IActivationToken=>{
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();  

    const token = jwt.sign({activationCode},process.env.ACTIVATION_SECRET as Secret,{
        expiresIn:"5m"
    });
    return {token,activationCode};
}