import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import { CouponValidations } from './coupon.validation';
import { CouponController } from './coupon.controller';

const router = Router();

router.post(
  '/',
  auth(TRole.ADMIN, TRole.MODERATOR),
  validateRequest(CouponValidations.createCouponValidation),
  CouponController.createCoupon,
);

router.get(
  '/',
  auth(TRole.ADMIN, TRole.MODERATOR),
  CouponController.getCoupons,
);
router.get(
  '/:couponId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  CouponController.getCouponById,
);
router.get(
  '/code/:code',
  auth(TRole.CUSTOMER),
  auth(...Object.values(TRole)),
  CouponController.getCouponByCode,
);

router.post(
  '/apply-coupon',
  auth(TRole.CUSTOMER),
  validateRequest(CouponValidations.applyCouponValidation),
  CouponController.applyCoupon,
);

router.put(
  '/:couponId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  validateRequest(CouponValidations.updateCouponValidation),
  CouponController.updateCoupon,
);

router.delete(
  '/:couponId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  CouponController.deleteCoupon,
);

export const CouponRouter = router;
