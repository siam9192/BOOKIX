import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TCoupon } from './coupon.interface';
import Coupon from './coupon.model';

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
  getCouponsFromDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
};
