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
exports.BookService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const book_model_1 = require("./book.model");
const QueryBuilder_1 = __importDefault(require("../../middlewares/QueryBuilder"));
const mongoose_1 = require("mongoose");
const func_1 = require("../../utils/func");
const createBookIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Creating book into db
    return yield book_model_1.Book.create(payload);
});
const createMultipleBooksIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.insertMany(payload);
});
const getBooksFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if (query.categories) {
        query.category = { $in: query.categories.split(',') };
        delete query.categories;
    }
    const sort = query.sort;
    let yetToSort;
    if (sort) {
        switch (sort) {
            case 'price(l-h)':
                yetToSort = sort;
                delete query.sort;
                break;
            case 'price(h-l)':
                yetToSort = sort;
                delete query.sort;
                break;
            case 'rating(l-h)':
                query.sort = 'rating';
                break;
            case 'rating(h-l)':
                query.sort = '-rating';
                break;
            default:
                break;
        }
    }
    // Get books which are not paused and not deleted
    query.is_paused = false;
    query.is_deleted = false;
    // Filtering books
    let result = yield new QueryBuilder_1.default(book_model_1.Book.find(), query)
        .textSearch()
        .find()
        .sort()
        .paginate()
        .project('name', 'price', 'cover_images', 'rating')
        .get();
    const meta = yield new QueryBuilder_1.default(book_model_1.Book.find(), query)
        .textSearch()
        .find()
        .project('name', 'price', 'cover_images', 'rating')
        .getMeta();
    if (yetToSort) {
        const modifiedResult = result
            .map((item) => {
            const modifiedItem = Object.assign({}, item._doc);
            if (item.price.enable_discount_price) {
                modifiedItem.currentPrice = item.price.discount_price;
            }
            else {
                modifiedItem.currentPrice = item.price.main_price;
            }
            return modifiedItem;
        })
            .sort((a, b) => {
            if (yetToSort === 'price(l-h)') {
                return a.currentPrice - b.currentPrice;
            }
            else {
                return b.currentPrice - a.currentPrice;
            }
        });
        result = modifiedResult;
    }
    return {
        result,
        meta,
    };
});
const getBookFromDB = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.findById(bookId).populate('author_bio');
});
const getFeaturedBooksFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get books which are not paused and not deleted
    const query = {
        is_paused: false,
        is_deleted: false,
    };
    return yield book_model_1.Book.find(query).sort({ rating: -1 }).limit(12);
});
const getSuggestedBooksFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get books which are not paused and not deleted
    const query = {
        is_paused: false,
        is_deleted: false,
    };
    return yield book_model_1.Book.find().sort({ sold: -1 }).limit(12);
});
const getRecentlyViewedBooks = (bookIds) => __awaiter(void 0, void 0, void 0, function* () {
    const objectIds = bookIds.map((id) => new mongoose_1.Types.ObjectId(id));
    return yield book_model_1.Book.find({ _id: { $in: objectIds } });
});
const getRelatedBooksFromDB = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(bookId);
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    const result = yield book_model_1.Book.find({
        _id: { $not: { $eq: (0, func_1.objectId)(bookId) } },
        category: book.category,
    }).limit(6);
    return result;
});
const deleteBookFromDB = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(bookId);
    // Checking book existence and is the book already deleted
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    else if (book.is_deleted) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Book is already deleted');
    }
    return book_model_1.Book.findByIdAndUpdate(bookId, { is_deleted: true }, { new: true });
});
const updateBookIntoDB = (bookId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(bookId);
    // Checking book existence
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    return yield book_model_1.Book.findByIdAndUpdate(bookId, payload);
});
const pauseBookIntoDB = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(bookId);
    // Checking book existence and is the book already paused
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    else if (book.is_paused) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Book is already paused');
    }
    const result = yield book_model_1.Book.findByIdAndUpdate(bookId, { is_paused: true }, { new: true });
    return result;
});
const unpauseBookIntoDB = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(bookId);
    // Checking book existence and is the book already paused
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    else if (!book.is_paused) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Book is already unpaused');
    }
    const result = yield book_model_1.Book.findByIdAndUpdate(bookId, { is_paused: false }, { new: true });
    return result;
});
const getBooksBasedOnDiscountFromDB = (discount, query) => __awaiter(void 0, void 0, void 0, function* () {
    const discountNumber = Number(discount);
    if (!discountNumber) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Something went wrong');
    }
    const limit = query.limit || 6;
    const result = yield book_model_1.Book.aggregate([
        {
            $match: {
                'price.enable_discount_price': true,
                is_paused: false,
                is_deleted: false,
            },
        },
        {
            $addFields: {
                discount_percentage: {
                    $multiply: [
                        {
                            $divide: [
                                {
                                    $subtract: ['$price.main_price', '$price.discount_price'],
                                },
                                '$price.main_price',
                            ],
                        },
                        100,
                    ],
                },
            },
        },
        {
            $match: {
                discount_percentage: { $lte: discountNumber },
            },
        },
        {
            $limit: Number(limit),
        },
        {
            $project: {
                name: 1,
                price: 1,
                cover_images: 1,
                rating: 1,
                discount_percentage: 1,
            },
        },
    ]);
    return result;
});
const getAuthorBooksFromDB = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.find({ author_bio: (0, func_1.objectId)(authorId) }).select([
        'name',
        'price',
        'cover_images',
        'rating',
    ]);
});
exports.BookService = {
    createBookIntoDB,
    createMultipleBooksIntoDB,
    getBooksFromDB,
    getBookFromDB,
    getFeaturedBooksFromDB,
    getSuggestedBooksFromDB,
    getRecentlyViewedBooks,
    getBooksBasedOnDiscountFromDB,
    getRelatedBooksFromDB,
    deleteBookFromDB,
    updateBookIntoDB,
    pauseBookIntoDB,
    unpauseBookIntoDB,
};
