'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CouponService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const coupon_interface_1 = require('./coupon.interface');
const coupon_model_1 = __importDefault(require('./coupon.model'));
const book_model_1 = require('../book/book.model');
const func_1 = require('../../utils/func');
const createCouponIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findOne({
      coupon_code: payload.coupon_code,
    });
    // Checking is there any coupon running on the same coupon code
    if (coupon) {
      throw new AppError_1.default(
        http_status_1.default.FOUND,
        'This coupon code is already running please try another',
      );
    }
    return yield coupon_model_1.default.create(payload);
  });
const getCouponByCodeFromDB = (code) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield coupon_model_1.default.findOne({
      coupon_code: code,
      valid_until: { $gte: new Date() },
    });
  });
const applyCoupon = (_a, userId_1) =>
  __awaiter(
    void 0,
    [_a, userId_1],
    void 0,
    function* ({ code, items }, userId) {
      const coupon = yield coupon_model_1.default.findOne({
        coupon_code: code,
      });
      // Checking coupon existence
      if (!coupon) {
        throw new AppError_1.default(
          http_status_1.default.NOT_FOUND,
          'Coupon not found',
        );
      }
      // Checking is customer account applicable for this coupon
      if (coupon.specific_customers !== '**') {
        const isCustomerExist = coupon.specific_customers.find(
          (id) => id === userId,
        );
        if (!isCustomerExist) {
          throw new AppError_1.default(
            http_status_1.default.NOT_ACCEPTABLE,
            'This Coupon is not applicable for you account',
          );
        }
      }
      const currentDate = new Date().valueOf();
      const validFrom = new Date(coupon.valid_from).valueOf();
      const expireDate = new Date(coupon.valid_until).valueOf();
      if (validFrom > currentDate) {
        throw new AppError_1.default(
          http_status_1.default.NOT_ACCEPTABLE,
          'This coupon can not be applicable this time',
        );
      }
      if (currentDate > expireDate) {
        throw new AppError_1.default(
          http_status_1.default.NOT_ACCEPTABLE,
          'This coupon is expired',
        );
      }
      const books = yield book_model_1.Book.find({
        _id: {
          $in: items.map((item) => (0, func_1.objectId)(item.book.toString())),
        },
      });
      if (books.length !== items.length) {
        throw new AppError_1.default(400, 'Something went wrong');
      }
      if (coupon.applicable_categories !== '**') {
        books.forEach((item) => {
          if (!coupon.applicable_categories.includes(item.category)) {
            throw new AppError_1.default(
              http_status_1.default.NOT_ACCEPTABLE,
              `This can is applicable for ${coupon.applicable_categories.join(',')} category books`,
            );
          }
        });
      }
      let subtotal = 0;
      let discount = 0;
      books.forEach((book) => {
        const item = items.find(
          (i) => i.book.toString() === book._id.toString(),
        );
        if (!item) {
          throw new AppError_1.default(400, 'Something went wrong');
        }
        subtotal +=
          (book.price.enable_discount_price
            ? book.price.discount_price
            : book.price.main_price) * item.quantity;
      });
      if (subtotal < coupon.minimum_purchase_amount) {
        throw new AppError_1.default(
          http_status_1.default.NOT_ACCEPTABLE,
          `This coupon is  applicable on at least ${coupon.minimum_purchase_amount} amount purchase `,
        );
      }
      if (
        coupon.discount_type ===
        coupon_interface_1.TCouponDiscountType.PERCENTAGE
      ) {
        discount = (coupon.discount_amount / subtotal) * subtotal;
      } else {
        discount = coupon.discount_amount;
      }
      return {
        code,
        discount,
      };
    },
  );
const getCouponByIdFromDB = (couponId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield coupon_model_1.default.findById(couponId);
  });
const getCouponsFromDB = (query) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield coupon_model_1.default.find();
  });
const updateCouponIntoDB = (couponId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findById(couponId);
    // Checking coupon existence
    if (!coupon) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Coupon not found',
      );
    }
    return yield coupon_model_1.default.findByIdAndUpdate(couponId, payload, {
      new: true,
    });
  });
const deleteCouponFromDB = (couponId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findById(couponId);
    // Checking coupon existence
    if (!coupon) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Coupon not found',
      );
    }
    return yield coupon_model_1.default.findByIdAndDelete(couponId, {
      new: true,
    });
  });
exports.CouponService = {
  createCouponIntoDB,
  getCouponByCodeFromDB,
  getCouponByIdFromDB,
  applyCoupon,
  getCouponsFromDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
};
