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
exports.ReviewService = void 0;
const mongoose_1 = require('mongoose');
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const review_model_1 = require('./review.model');
const http_status_1 = __importDefault(require('http-status'));
const QueryBuilder_1 = __importDefault(
  require('../../middlewares/QueryBuilder'),
);
const order_model_1 = require('../order/order.model');
const order_interface_1 = require('../order/order.interface');
const func_1 = require('../../utils/func');
const createReviewIntoDB = (userId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const order = yield order_model_1.Order.findById(payload.order).populate(
      'items',
    );
    // checking order existence
    if (!order) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Order not found',
      );
    } else if (order.status === order_interface_1.TOrderStatus.CANCELLED) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Review can not possible of this order',
      );
    } else if (order.status !== order_interface_1.TOrderStatus.DELIVERED) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Without complete the  delivery of the  review can not possible of this books',
      );
    }
    const orderedBooks = order.items.map((item) => item.book.toString());
    // Checking is the book purchase on this order
    if (!orderedBooks.includes(payload.book.toString())) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'With out purchase the book review can not possible',
      );
    }
    const isReviewed =
      (_a = order.items.find(
        (item) => item.book.toString() === payload.book.toString(),
      )) === null || _a === void 0
        ? void 0
        : _a.is_reviewed;
    if (isReviewed) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Book is already reviewed',
      );
    }
    payload.customer = (0, func_1.objectId)(userId);
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
      const updateResult = yield order_model_1.Order.updateOne(
        {
          _id: order._id,
          'items.book': (0, func_1.objectId)(payload.book.toString()),
        },
        { 'items.$.is_reviewed': true },
        { session },
      );
      if (!updateResult.modifiedCount) {
        throw new Error();
      }
      //  Checking is review created successfully
      const createdReview = yield review_model_1.Review.create([payload], {
        session,
      });
      if (!createdReview) {
        throw new Error();
      }
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw new AppError_1.default(
        400,
        'Review can not created something went wrong',
      );
    }
  });
const deleteReviewFromDB = (reviewId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.deleteOne({
      _id: (0, func_1.objectId)(reviewId),
    });
    if (!result.deletedCount) {
      throw new AppError_1.default(402, 'Delete unsuccessful');
    }
    return true;
  });
const getBookReviewsFromDB = (bookId, query) =>
  __awaiter(void 0, void 0, void 0, function* () {
    query.book = (0, func_1.objectId)(bookId);
    let data = yield new QueryBuilder_1.default(
      review_model_1.Review.find(),
      query,
    )
      .find()
      .paginate()
      .populate('customer')
      .get();
    const meta = yield new QueryBuilder_1.default(
      review_model_1.Review.find(),
      query,
    )
      .find()
      .paginate()
      .populate('customer')
      .getMeta();
    data = data.map((item) => {
      const doc = item._doc;
      const name = doc.customer.name;
      return {
        _id: doc._id,
        images: doc.images,
        rating: doc.rating,
        comment: doc.comment,
        customer: {
          // Concat customer name
          full_name:
            name.first_name +
            (name.middle_name ? ` ${name.middle_name}` : '') +
            (name.last_name ? ` ${name.last_name}` : ''),
        },
        createdAt: doc.createdAt || new Date(),
      };
    });
    return {
      data,
      meta,
    };
  });
const updateReviewIntoDB = (reviewId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId);
    // Checking review existence
    if (!review) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Review not found',
      );
    }
    return yield review_model_1.Review.findByIdAndUpdate(reviewId, payload, {
      runValidators: true,
      new: true,
    });
  });
exports.ReviewService = {
  createReviewIntoDB,
  deleteReviewFromDB,
  getBookReviewsFromDB,
  updateReviewIntoDB,
};
