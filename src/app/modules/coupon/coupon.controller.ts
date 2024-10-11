import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CouponService } from './coupon.service';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../utils/response';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCouponIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Coupon created successfully',
    data: result,
  });
});

const getCouponByCode = catchAsync(async (req: Request, res: Response) => {
  const couponCode = req.params.code;
  const result = await CouponService.getCouponByCodeFromDB(couponCode);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const couponId = req.params.couponId;
  const result = await CouponService.getCouponByIdFromDB(couponId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CouponService.applyCoupon(req.body, userId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupon applied successfully',
    data: result,
  });
});

const getCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.getCouponsFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupons retrieved successfully',
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const couponId = req.params.couponId;
  const result = await CouponService.updateCouponIntoDB(couponId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupon updated successfully',
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const couponId = req.params.couponId;
  const result = await CouponService.deleteCouponFromDB(couponId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getCouponByCode,
  applyCoupon,
  getCouponById,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};
