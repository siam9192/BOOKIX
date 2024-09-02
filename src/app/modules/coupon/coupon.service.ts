import httpStatus from "http-status";
import AppError from "../../Errors/AppError";
import { TCoupon } from "./coupon.interface";
import Coupon from "./coupon.model";

const createCouponIntoDB = async(payload:TCoupon)=>{
    const coupon = await Coupon.findOne({coupon_code:payload.coupon_code,valid_until:{$gt:new Date()}})
    
    // Checking is there any coupon running on the same coupon code
    if(coupon){
        throw new AppError(httpStatus.FOUND,'This coupon code is already running please try another')
    }

    return await Coupon.create(payload)
}