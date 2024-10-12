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
exports.PaymentService = exports.getUserPaymentHistoryFromDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../middlewares/QueryBuilder"));
const payment_model_1 = require("./payment.model");
const getPaymentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query.success = true;
    const data = yield new QueryBuilder_1.default(payment_model_1.Payment.find(), query)
        .find()
        .sort()
        .paginate()
        .get();
    const meta = yield new QueryBuilder_1.default(payment_model_1.Payment.find(), query).find().getMeta();
    return {
        data,
        meta,
    };
});
const getUserPaymentHistoryFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield new QueryBuilder_1.default(payment_model_1.Payment.find(), query)
        .find()
        .sort()
        .paginate()
        .populate('user')
        .get();
    const meta = yield new QueryBuilder_1.default(payment_model_1.Payment.find(), query)
        .find()
        .getMeta();
    return {
        data,
        meta
    };
});
exports.getUserPaymentHistoryFromDB = getUserPaymentHistoryFromDB;
const refundPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(payload.paymentId);
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found');
    }
    // Paypal.refund()
});
exports.PaymentService = {
    getPaymentsFromDB,
    getUserPaymentHistoryFromDB: exports.getUserPaymentHistoryFromDB,
};
