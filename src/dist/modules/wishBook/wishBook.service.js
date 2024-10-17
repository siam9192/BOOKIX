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
exports.WishBookService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const func_1 = require('../../utils/func');
const wishBook_model_1 = require('./wishBook.model');
const createWiseBookIntoDB = (userId, bookId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const wishBook = yield wishBook_model_1.WishBook.findOne({
      user: (0, func_1.objectId)(userId),
      book: (0, func_1.objectId)(bookId),
    });
    // Checking is the book already exists on user wishlist
    if (wishBook) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'This book is already added on your wishlist',
      );
    }
    const data = {
      book: bookId,
      user: userId,
    };
    return yield wishBook_model_1.WishBook.create(data);
  });
const getWishBooksFromDB = (userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield wishBook_model_1.WishBook.find({
      user: (0, func_1.objectId)(userId),
    }).populate('book');
  });
const deleteWiseBookFromDB = (userId, wishBookId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const wishBook = yield wishBook_model_1.WishBook.findOne({
      _id: (0, func_1.objectId)(wishBookId),
      user: (0, func_1.objectId)(userId),
    });
    // Checking book existence on wishlist
    if (!wishBook) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Book not not found in wishlist',
      );
    }
    return yield wishBook_model_1.WishBook.findByIdAndDelete(wishBookId, {
      new: true,
    });
  });
exports.WishBookService = {
  createWiseBookIntoDB,
  getWishBooksFromDB,
  deleteWiseBookFromDB,
};
