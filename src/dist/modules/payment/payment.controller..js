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
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const response_1 = require("../../utils/response");
const http_status_1 = __importDefault(require("http-status"));
const payment_service_1 = require("./payment.service");
const getPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentService.getPaymentsFromDB(req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Payments retrieved successfully',
        data: result.data,
        meta: result.meta
    });
}));
const getCurrentUserPaymentHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield payment_service_1.PaymentService.getUserPaymentHistoryFromDB(userId, req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Payments retrieved successfully',
        data: result.data,
        meta: result.meta
    });
}));
const getUserPaymentHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const result = yield payment_service_1.PaymentService.getUserPaymentHistoryFromDB(userId, req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Payments retrieved successfully',
        data: result.data,
        meta: result.meta
    });
}));
exports.PaymentController = {
    getPayments,
    getCurrentUserPaymentHistory,
    getUserPaymentHistory,
};
