"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const coupon_service_1 = require("./coupon.service");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../utils/response");
const createCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponService.createCouponIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Coupon created successfully',
        data: result,
    });
}));
const getCouponByCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const couponCode = req.params.code;
    const result = yield coupon_service_1.CouponService.getCouponByCodeFromDB(couponCode);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Coupon retrieved successfully',
        data: result,
    });
}));
const getCouponById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const couponId = req.params.couponId;
    const result = yield coupon_service_1.CouponService.getCouponByIdFromDB(couponId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Coupon retrieved successfully',
        data: result,
    });
}));
const applyCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield coupon_service_1.CouponService.applyCoupon(req.body, userId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Coupon applied successfully',
        data: result,
    });
}));
const getCoupons = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_service_1.CouponService.getCouponsFromDB(req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Coupons retrieved successfully',
        data: result,
    });
}));
const updateCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const couponId = req.params.couponId;
    const result = yield coupon_service_1.CouponService.updateCouponIntoDB(couponId, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Coupon updated successfully',
        data: result,
    });
}));
const deleteCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const couponId = req.params.couponId;
    const result = yield coupon_service_1.CouponService.deleteCouponFromDB(couponId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Coupon deleted successfully',
        data: result,
    });
}));
exports.CouponController = {
    createCoupon,
    getCouponByCode,
    applyCoupon,
    getCouponById,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};
