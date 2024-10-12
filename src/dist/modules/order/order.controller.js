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
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const response_1 = require("../../utils/response");
const http_status_1 = __importDefault(require("http-status"));
const order_service_1 = require("./order.service");
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield order_service_1.OrderService.createOrderIntoDB(res, userId, req.body);
}));
const managePaymentSuccessOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.query.paymentId;
    const result = yield order_service_1.OrderService.managePaymentSuccessOrdersIntoDB(orderId);
}));
const managePaypalPaymentSuccessOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.managePaypalPaymentSuccessOrdersIntoDB(res, req.query);
}));
const getOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.getOrdersFromDB(req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Orders retrieved successfully',
        data: result,
    });
}));
const getCurrentUserOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield order_service_1.OrderService.getCurrentUserOrdersFromDB(userId, req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Orders retrieved successfully',
        data: result,
    });
}));
const getUserOrderHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const result = yield order_service_1.OrderService.getUserOrderHistoryFromDB(userId, req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User Order history retrieved successfully',
        data: result,
    });
}));
const getCurrentUserOrderHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield order_service_1.OrderService.getUserOrderHistoryFromDB(userId, req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Order history retrieved successfully',
        data: result,
    });
}));
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.OrderService.updateOrderStatus(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Orders status updated successfully',
        data: result,
    });
}));
const managePaymentCanceledOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = req.query.paymentId;
    const result = yield order_service_1.OrderService.managePaymentCanceledOrderIntoDB(paymentId);
    res.redirect('https://www.youtube.com/');
}));
const getCustomerYetToReviewOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield order_service_1.OrderService.getCustomerYetToReviewOrdersFromDB(userId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Yet to review order retrieved successfully',
        data: result,
    });
}));
const getOrderDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const result = yield order_service_1.OrderService.getOrderDetailsFromDB(orderId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Order details retrieved successfully',
        data: result,
    });
}));
const cancelOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const { id: userId, role: userRole } = req.user;
    const result = yield order_service_1.OrderService.cancelOrderIntoDB(userId, userRole, orderId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Order cancelled successfully',
        data: result,
    });
}));
exports.OrderController = {
    createOrder,
    managePaymentSuccessOrders,
    managePaypalPaymentSuccessOrders,
    getOrders,
    updateOrderStatus,
    managePaymentCanceledOrder,
    getCustomerYetToReviewOrders,
    getCurrentUserOrders,
    getOrderDetails,
    cancelOrder,
    getCurrentUserOrderHistory,
    getUserOrderHistory,
};
