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
exports.AuthorService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const QueryBuilder_1 = __importDefault(
  require('../../middlewares/QueryBuilder'),
);
const author_model_1 = require('./author.model');
const book_model_1 = require('../book/book.model');
const func_1 = require('../../utils/func');
const createAuthorIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield author_model_1.Author.create(payload);
  });
const getAuthorFromDB = (authorId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return author_model_1.Author.findById(authorId);
  });
const getAuthorsFromDB = (name) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const query = {
      searchTerm: name,
    };
    const data = yield new QueryBuilder_1.default(
      author_model_1.Author.find(),
      query,
    )
      .textSearch()
      .paginate()
      .get();
    const meta = yield new QueryBuilder_1.default(
      author_model_1.Author.find(),
      query,
    )
      .textSearch()
      .getMeta();
    return {
      data,
      meta,
    };
  });
const updateAuthorIntoDB = (authorId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const author = yield author_model_1.Author.findById(authorId);
    // Checking author existence
    if (!author) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Author not found',
      );
    }
    //   Updating author details
    return yield author_model_1.Author.findByIdAndUpdate(authorId, payload, {
      new: true,
      runValidators: true,
    });
  });
const deleteAuthorFromDB = (authorId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const author = yield author_model_1.Author.findById(authorId);
    // Checking author existence
    if (!author) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Author not found',
      );
    }
    return yield author_model_1.Author.findByIdAndDelete(authorId, {
      new: true,
    });
  });
const getPopularAuthorsFromDB = (query) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const data = yield new QueryBuilder_1.default(
      author_model_1.Author.find(),
      query,
    )
      .find()
      .sort()
      .paginate()
      .get();
    const meta = yield new QueryBuilder_1.default(
      author_model_1.Author.find(),
      query,
    )
      .find()
      .getMeta();
    return {
      data,
      meta,
    };
  });
const getAuthorBooksFromDB = (authorId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield book_model_1.Book.find({
      author_bio: (0, func_1.objectId)(authorId),
    }).select(['name', 'price', 'cover_images', 'rating']);
  });
exports.AuthorService = {
  createAuthorIntoDB,
  getAuthorFromDB,
  getAuthorsFromDB,
  getPopularAuthorsFromDB,
  updateAuthorIntoDB,
  deleteAuthorFromDB,
};
