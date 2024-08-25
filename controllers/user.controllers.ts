import { Request,Response,NextFunction } from "express";
import userModel, {IUser} from "../models/user.model";
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

    const token = jwt.sign(
        {user,
        activationCode
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
        expiresIn:"5m"
        }
    );
    return {token,activationCode};
}


//activate user
interface IActivationRequest {
    activation_token : string;
    activation_code : string;
}

export const activateUser = catchAsyncErrors(
    async(req:Request,res:Response, next:NextFunction)=>{
        console.log("activateuser hit")
        try{
            const {activation_token, activation_code} = req.body as IActivationRequest;

            const newUser:{user:IUser; activationCode:string} = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as {user:IUser; activationCode:string};

            if (newUser.activationCode !== activation_code){
                return next(new ErrorHandler("Invalid activation code",400));
            }

            const {name,email,password} = newUser.user;
            

            const existUser = await userModel.findOne({email});

            if(existUser){
                return next(new ErrorHandler("User already exists",400));
            }

            const user = await userModel.create({
                name,
                email,
                password,
            });

            res.status(201).json({
                success:true,
            });
        }catch(error:any){
            return next(new ErrorHandler(error.message, 400));
        }

    }
)

//login user

interface IloginRequest{
    email:string;
    password: string;
}

export const loginUser = catchAsyncErrors( async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email, password} = req.body as IloginRequest;
        if(!email || !password){
            return next(new ErrorHandler("Invalid email or password",400));
        }
        const user = await userModel.findOne({email}).select("password");

        if(!user){
            return next (new ErrorHandler("user not found", 404));
        }
        const isPasswordMatched = user.comparePassword(password)
    }
    catch(err:any){
        return next(new ErrorHandler(err.message,400));
    }
}

)
