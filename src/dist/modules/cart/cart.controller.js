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
exports.cartController = void 0;
const http_status_1 = __importDefault(require('http-status'));
const catchAsync_1 = __importDefault(require('../../utils/catchAsync'));
const response_1 = require('../../utils/response');
const cart_service_1 = require('./cart.service');
const createCart = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield cart_service_1.CartService.createCartItemIntoDB(
      userId,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: 'Cart item creates successfully successfully',
      data: result,
    });
  }),
);
const getCartItems = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield cart_service_1.CartService.getCartItemsFromDB(userId);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: 'Cart items retrieved successfully successfully',
      data: result,
    });
  }),
);
const updateCartItemQuantity = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result =
      yield cart_service_1.CartService.updateCartItemQuantityIntoDB(
        userId,
        req.body,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: 'Cart item quantity updated successfully successfully',
      data: result,
    });
  }),
);
const deleteCartItem = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const cartItemId = req.params.itemId;
    const result = yield cart_service_1.CartService.deleteCartItemFromDB(
      userId,
      cartItemId,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: 'Cart deleted successfully successfully',
      data: result,
    });
  }),
);
const deleteMultipleCartItems = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const cartItemIds = req.body.itemIds;
    const result =
      yield cart_service_1.CartService.getCartItemsFromDB(cartItemIds);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.CREATED,
      message: 'Cart items deleted successfully successfully',
      data: result,
    });
  }),
);
exports.cartController = {
  createCart,
  getCartItems,
  updateCartItemQuantity,
  deleteCartItem,
  deleteMultipleCartItems,
};
