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
exports.CartService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const book_model_1 = require("../book/book.model");
const cart_model_1 = require("./cart.model");
const func_1 = require("../../utils/func");
const createCartItemIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(payload.book);
    //  Checking book existence and is book deleted or paused
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    else if (book.is_deleted || book.is_paused) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'This Book can not be add to cart');
    }
    const cartItem = yield cart_model_1.Cart.findOne({
        book: book._id,
        user: (0, func_1.objectId)(userId),
    });
    //  Checking if this book already exists on cart
    if (cartItem) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'This book already on your cart');
    }
    payload.user = (0, func_1.objectId)(userId);
    //  Creating cart
    const result = yield cart_model_1.Cart.create(payload);
    return result;
});
const getCartItemsFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart_model_1.Cart.find({ user: (0, func_1.objectId)(userId) }).populate('book');
});
const getLocalCartItems = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = payload.ids.map((id) => func_1.objectId);
    return yield cart_model_1.Cart.find();
});
const updateCartItemQuantityIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart_model_1.Cart.findOneAndUpdate({ _id: (0, func_1.objectId)(payload.itemId), user: (0, func_1.objectId)(userId) }, { quantity: payload.quantity });
});
const deleteCartItemFromDB = (userId, cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield cart_model_1.Cart.findOneAndDelete({
        _id: (0, func_1.objectId)(cartItemId),
        user: (0, func_1.objectId)(userId),
    });
});
const deleteMultipleCartItems = (cartItemIds) => __awaiter(void 0, void 0, void 0, function* () {
    const objectIds = cartItemIds.map((id) => (0, func_1.objectId)(id));
    return yield cart_model_1.Cart.deleteMany({ _id: { $in: objectIds } });
});
exports.CartService = {
    createCartItemIntoDB,
    getCartItemsFromDB,
    updateCartItemQuantityIntoDB,
    deleteCartItemFromDB,
    deleteMultipleCartItems,
};
