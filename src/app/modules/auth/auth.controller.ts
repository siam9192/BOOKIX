import catchAsync from "../../utils/catchAsync";
import {Request, Response} from 'express'
import { AuthService } from "./auth.services";
import { sendSuccessResponse } from "../../utils/response";
import httpStatus from "http-status";

const handelSignupRequest = catchAsync(async(req:Request,res:Response)=>{
    const result = await AuthService.signUpRequest(req.body)
    sendSuccessResponse(res,{
        statusCode:httpStatus.OK,
        message:"6 digit Otp has been send to your email",
        data:result
    })
})


const handelResendRequest = catchAsync(async(req:Request,res:Response)=>{
    const result = await AuthService.resendOtp(req.body)
    sendSuccessResponse(res,{
        statusCode:httpStatus.OK,
        message:"6 digit Otp has been send to your email",
        data:null
    })
})

const handelSignupVerify = catchAsync(async(req:Request,res:Response)=>{
    const result = await AuthService.signUpVerify(req.body)
    sendSuccessResponse(res,{
        statusCode:httpStatus.OK,
        message:"Account verification successful",
        data:result
    })
})


export const AuthController = {
    handelSignupRequest,
    handelResendRequest,
    handelSignupVerify
}