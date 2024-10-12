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
exports.BookController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const book_service_1 = require("./book.service");
const response_1 = require("../../utils/response");
const http_status_1 = __importDefault(require("http-status"));
const createBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.BookService.createBookIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Book created successfully',
        data: result,
    });
}));
const createMultipleBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.BookService.createMultipleBooksIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Books created successfully',
        data: result,
    });
}));
const getBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.BookService.getBooksFromDB(req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Books retrieved successfully',
        data: result.result,
        meta: result.meta
    });
}));
const getBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield book_service_1.BookService.getBookFromDB(bookId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Book retrieved successfully',
        data: result,
    });
}));
const getFeaturedBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.BookService.getFeaturedBooksFromDB();
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Featured Books retrieved successfully',
        data: result,
    });
}));
const getSuggestBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.BookService.getSuggestedBooksFromDB();
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Suggested Books retrieved successfully',
        data: result,
    });
}));
const getRecentlyViewedBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookIds = req.body.bookIds;
    const result = yield book_service_1.BookService.getRecentlyViewedBooks(bookIds);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Recently viewed Books retrieved successfully',
        data: result,
    });
}));
const updateBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield book_service_1.BookService.updateBookIntoDB(bookId, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Book updated successfully',
        data: result,
    });
}));
const deleteBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield book_service_1.BookService.deleteBookFromDB(bookId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Book deleted successfully',
        data: result,
    });
}));
const pauseBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield book_service_1.BookService.pauseBookIntoDB(bookId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Book Paused successfully',
        data: result,
    });
}));
const unpauseBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield book_service_1.BookService.unpauseBookIntoDB(bookId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Book unpaused successfully',
        data: result,
    });
}));
const getBooksBasedOnDiscount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = req.params.percentage;
    const result = yield book_service_1.BookService.getBooksBasedOnDiscountFromDB(discount, req.query);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Books retrieved  successfully based on discount',
        data: result,
    });
}));
const getRelatedBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield book_service_1.BookService.getRelatedBooksFromDB(bookId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Related Books retrieved successfully',
        data: result,
    });
}));
exports.BookController = {
    createBook,
    createMultipleBooks,
    getBooks,
    getBook,
    getFeaturedBooks,
    getSuggestBooks,
    getRecentlyViewedBooks,
    getBooksBasedOnDiscount,
    getRelatedBooks,
    updateBook,
    deleteBook,
    pauseBook,
    unpauseBook,
};
