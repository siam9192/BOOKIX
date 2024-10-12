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
exports.ReviewController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const review_service_1 = require("./review.service");
const response_1 = require("../../utils/response");
const http_status_1 = __importDefault(require("http-status"));
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield review_service_1.ReviewService.createReviewIntoDB(userId, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Review created successfully',
        data: result,
    });
}));
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = review_service_1.ReviewService.deleteReviewFromDB(id);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Review deleted successfully',
        data: result,
    });
}));
const getBookReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const result = yield review_service_1.ReviewService.getBookReviewsFromDB(bookId, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Review retrieved successfully',
        data: result,
    });
}));
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewId = req.params.reviewId;
    const result = yield review_service_1.ReviewService.updateReviewIntoDB(reviewId, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Review updated successfully',
        data: result,
    });
}));
exports.ReviewController = {
    createReview,
    deleteReview,
    getBookReviews,
    updateReview,
};
