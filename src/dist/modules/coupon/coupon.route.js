'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CouponRouter = void 0;
const express_1 = require('express');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const coupon_validation_1 = require('./coupon.validation');
const coupon_controller_1 = require('./coupon.controller');
const router = (0, express_1.Router)();
router.post(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    coupon_validation_1.CouponValidations.createCouponValidation,
  ),
  coupon_controller_1.CouponController.createCoupon,
);
router.get(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  coupon_controller_1.CouponController.getCoupons,
);
router.get(
  '/:couponId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  coupon_controller_1.CouponController.getCouponById,
);
router.get(
  '/code/:code',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  (0, auth_1.default)(...Object.values(user_interface_1.TRole)),
  coupon_controller_1.CouponController.getCouponByCode,
);
router.post(
  '/apply-coupon',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  (0, validateRequest_1.default)(
    coupon_validation_1.CouponValidations.applyCouponValidation,
  ),
  coupon_controller_1.CouponController.applyCoupon,
);
router.put(
  '/:couponId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    coupon_validation_1.CouponValidations.updateCouponValidation,
  ),
  coupon_controller_1.CouponController.updateCoupon,
);
router.delete(
  '/:couponId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  coupon_controller_1.CouponController.deleteCoupon,
);
exports.CouponRouter = router;
