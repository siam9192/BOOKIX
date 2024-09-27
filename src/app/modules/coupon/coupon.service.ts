import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TCoupon, TCouponDiscountType } from './coupon.interface';
import Coupon from './coupon.model';
import cookieParser from 'cookie-parser';
import { Book } from '../book/book.model';
import { objectId } from '../../utils/func';
import { boolean } from 'zod';
import { TCart } from '../cart/cart.interface';

const createCouponIntoDB = async (payload: TCoupon) => {
  const coupon = await Coupon.findOne({ coupon_code: payload.coupon_code });
  // Checking is there any coupon running on the same coupon code
  if (coupon) {
    throw new AppError(
      httpStatus.FOUND,
      'This coupon code is already running please try another',
    );
  }

  return await Coupon.create(payload);
};

const getCouponByCodeFromDB = async (code: string) => {
  return await Coupon.findOne({
    coupon_code: code,
    valid_until: { $gte: new Date() },
  });
};


const applyCoupon = async ({code,items}:{code:string,items:TCart[]},userId:string)=>{
  const coupon = await Coupon.findOne({coupon_code:code})
  
  // Checking coupon existence 
  if(!coupon){
    throw new AppError(httpStatus.NOT_FOUND,'Coupon not found')
  }
  
  // Checking is customer account applicable for this coupon
  if(coupon.specific_customers !== '**'){
    const isCustomerExist = coupon.specific_customers.find(id=> id === userId)
    if(!isCustomerExist){
      throw new AppError(httpStatus.NOT_ACCEPTABLE,'This Coupon is not applicable for you account')
    }
  }
  
  const currentDate = new Date().valueOf()
  const validFrom = new Date(coupon.valid_from).valueOf()
  const expireDate = new Date(coupon.valid_until).valueOf()
 
  
  if(validFrom > currentDate){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,"This coupon can not be applicable this time")
  }
  if(currentDate > expireDate){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'This coupon is expired')
  }

  
  const books = await Book.find({_id:{$in:items.map(item=>objectId(item.book.toString()))}})
  
  if(books.length !== items.length){
    throw new AppError(400,'Something went wrong')
}

  if(coupon.applicable_categories !== '**'){
   
   
    books.forEach(item=>{
      if(!coupon.applicable_categories.includes(item.category)){
        throw new AppError(httpStatus.NOT_ACCEPTABLE,`This can is applicable for ${(coupon.applicable_categories as string[]).join(',')} category books`)
      }
    })
  } 

 let subtotal = 0
 let discount = 0

 books.forEach(book=>{
  const item = items.find(i=> i.book.toString() === book._id.toString())
   
  if(!item){
    throw new AppError(400,'Something went wrong')
  }

  subtotal += (book.price.enable_discount_price ?  book.price.discount_price :book.price.main_price)*item.quantity

 })
 
 if(subtotal<coupon.minimum_purchase_amount){
  throw new AppError(httpStatus.NOT_ACCEPTABLE,`This coupon is  applicable on at least ${coupon.minimum_purchase_amount} amount purchase `)
 }

 if(coupon.discount_type === TCouponDiscountType.PERCENTAGE){
  discount =  (coupon.discount_amount/subtotal)*subtotal
 }
 else {
  discount = coupon.discount_amount
 }

 return {
  code,
  discount
 }

}


const getCouponByIdFromDB = async (couponId: string) => {
  return await Coupon.findById(couponId);
};

const getCouponsFromDB = async (query: any) => {
  return await Coupon.find();
};

const updateCouponIntoDB = async (
  couponId: string,
  payload: Partial<TCoupon>,
) => {
  const coupon = await Coupon.findById(couponId);

  // Checking coupon existence
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }

  return await Coupon.findByIdAndUpdate(couponId, payload, { new: true });
};

const deleteCouponFromDB = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);

  // Checking coupon existence
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }

  return await Coupon.findByIdAndDelete(couponId, { new: true });
};

export const CouponService = {
  createCouponIntoDB,
  getCouponByCodeFromDB,
  getCouponByIdFromDB,
  applyCoupon,
  getCouponsFromDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
};
