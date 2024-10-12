"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_interface_1 = require("../user/user.interface");
const payment_controller_1 = require("./payment.controller.");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_interface_1.TRole.ADMIN), payment_controller_1.PaymentController.getPayments);
router.get('/current-user', (0, auth_1.default)(user_interface_1.TRole.CUSTOMER), payment_controller_1.PaymentController.getCurrentUserPaymentHistory);
router.get('/user/:userId', (0, auth_1.default)(user_interface_1.TRole.ADMIN, user_interface_1.TRole.MODERATOR), payment_controller_1.PaymentController.getUserPaymentHistory);
exports.PaymentRouter = router;
