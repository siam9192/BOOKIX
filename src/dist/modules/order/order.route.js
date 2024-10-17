'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrderRouter = void 0;
const express_1 = require('express');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const order_validation_1 = require('./order.validation');
const order_controller_1 = require('./order.controller');
const constant_1 = require('../../utils/constant');
const router = (0, express_1.Router)();
router.post(
  '/',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  (0, validateRequest_1.default)(
    order_validation_1.OrderValidations.createOrderValidation,
  ),
  order_controller_1.OrderController.createOrder,
);
router.get(
  '/payment-success',
  order_controller_1.OrderController.managePaymentSuccessOrders,
);
router.get(
  '/payment/paypal/success',
  order_controller_1.OrderController.managePaypalPaymentSuccessOrders,
);
// Payment cancel
router.get(
  '/payment/cancel',
  order_controller_1.OrderController.managePaymentCanceledOrder,
);
router.get(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  order_controller_1.OrderController.getOrders,
);
// Get customer not reviewed product after order
router.get(
  '/current-user/customer/yet-to-review',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  order_controller_1.OrderController.getCustomerYetToReviewOrders,
);
// Get current user orders
router.get(
  '/current-user',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  order_controller_1.OrderController.getCurrentUserOrders,
);
// Get current user order history
router.get(
  '/history/current-user',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  order_controller_1.OrderController.getCurrentUserOrderHistory,
);
// Get current user order history
router.get(
  '/history/user/:userId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  order_controller_1.OrderController.getUserOrderHistory,
);
// Get order details
router.get(
  '/order-details/:orderId',
  (0, auth_1.default)(...Object.values(user_interface_1.TRole)),
  order_controller_1.OrderController.getOrderDetails,
);
router.patch(
  '/update-status',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  order_controller_1.OrderController.updateOrderStatus,
);
router.patch(
  '/cancel/:orderId',
  (0, auth_1.default)(...constant_1.AllRole),
  order_controller_1.OrderController.cancelOrder,
);
exports.OrderRouter = router;
