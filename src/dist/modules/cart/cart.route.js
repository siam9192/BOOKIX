'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CartRouter = void 0;
const express_1 = require('express');
const cart_controller_1 = require('./cart.controller');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const cart_validation_1 = require('./cart.validation');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const router = (0, express_1.Router)();
router.get(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.CUSTOMER,
    user_interface_1.TRole.MODERATOR,
    user_interface_1.TRole.MODERATOR,
  ),
  cart_controller_1.cartController.getCartItems,
);
router.post(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.CUSTOMER,
    user_interface_1.TRole.MODERATOR,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    cart_validation_1.CartValidation.createCartItemValidation,
  ),
  cart_controller_1.cartController.createCart,
);
router.patch(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.CUSTOMER,
    user_interface_1.TRole.MODERATOR,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    cart_validation_1.CartValidation.updateCartItemQuantityValidation,
  ),
  cart_controller_1.cartController.updateCartItemQuantity,
);
router.delete(
  '/:itemId',
  (0, auth_1.default)(
    user_interface_1.TRole.CUSTOMER,
    user_interface_1.TRole.MODERATOR,
    user_interface_1.TRole.MODERATOR,
  ),
  cart_controller_1.cartController.deleteCartItem,
);
exports.CartRouter = router;
