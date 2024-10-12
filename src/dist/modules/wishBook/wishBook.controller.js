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
exports.WishBookController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const wishBook_service_1 = require("./wishBook.service");
const response_1 = require("../../utils/response");
const http_status_1 = __importDefault(require("http-status"));
const createWiseBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const bookId = req.body.bookId;
    const result = yield wishBook_service_1.WishBookService.createWiseBookIntoDB(userId, bookId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Wish book created successfully on wishlist',
        data: result,
    });
}));
const getWishBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield wishBook_service_1.WishBookService.getWishBooksFromDB(userId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Wish book create on wishlist',
        data: result,
    });
}));
const deleteWiseBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const wishBookId = req.body.wishBookId;
    const result = yield wishBook_service_1.WishBookService.deleteWiseBookFromDB(userId, wishBookId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Wish book create on wishlist',
        data: result,
    });
}));
exports.WishBookController = {
    createWiseBook,
    getWishBooks,
    deleteWiseBook,
};
