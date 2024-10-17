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
Object.defineProperty(exports, '__esModule', { value: true });
exports.Review = void 0;
const mongoose_1 = require('mongoose');
const reviewSchema = new mongoose_1.Schema(
  {
    images: {
      type: [String],
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    is_hidden: {
      type: Boolean,
      default: false,
    },
    book: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    order: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customer: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
reviewSchema.statics.isReviewExists = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.Review.findById(id);
  });
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
