'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ReviewRouter = void 0;
const express_1 = require('express');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const review_validation_1 = require('./review.validation');
const review_controller_1 = require('./review.controller');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const router = (0, express_1.Router)();
router.post(
  '/',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  (0, validateRequest_1.default)(
    review_validation_1.reviewValidations.createReviewValidation,
  ),
  review_controller_1.ReviewController.createReview,
);
router.get(
  '/book/:bookId',
  review_controller_1.ReviewController.getBookReviews,
);
router.delete(
  '/:reviewId',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  review_controller_1.ReviewController.deleteReview,
);
router.patch(
  '/:reviewId',
  (0, auth_1.default)(user_interface_1.TRole.CUSTOMER),
  (0, validateRequest_1.default)(
    review_validation_1.reviewValidations.reviewUpdateValidation,
  ),
  review_controller_1.ReviewController.updateReview,
);
exports.ReviewRouter = router;
