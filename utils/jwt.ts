require('dotenv').config();
import {Response} from 'express';
import {IUser} from '../models/user.model';
import {redis} from "./redis";
import ErrorHandler from './ErrorHandler';

interface ITokenOptions {
    expires:Date;
    maxAge:number;
    httpOnly:boolean;
    sameSite:"lax"|"strict"|"none"|undefined;
    secure?:boolean;
}

//parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE || "5",
    10
);

const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE||"72",
    10
);

//options for cookies
export const accessTokenOptions:ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire*60*1000), //
    maxAge:accessTokenExpire*3600*1000,
    httpOnly:true,
    sameSite:"none",
    secure:true,
};

export const refreshTokenOptions:ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire*3600*1000),
    maxAge:accessTokenExpire*60*1000,
    httpOnly:true,
    sameSite:"none",
    secure:true,
};

export const sendToken = (user:IUser,statusCode:number,res:Response) =>{
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // upload session to redis
    try{
        redis.set(user.id, JSON.stringify(user) as any,);
    }catch(err:any){
        return new ErrorHandler(err.message,400)
    }
    

    res.cookie("access_token", accessToken,accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success:true,
        user,
        accessToken,
    })
};