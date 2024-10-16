'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BookRouter = void 0;
const express_1 = require('express');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const book_validations_1 = require('./book.validations');
const book_controller_1 = require('./book.controller');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const router = (0, express_1.Router)();
router.get('/', book_controller_1.BookController.getBooks);
router.get('/featured', book_controller_1.BookController.getFeaturedBooks);
router.get('/suggested', book_controller_1.BookController.getSuggestBooks);
router.post(
  '/recently-viewed',
  (0, validateRequest_1.default)(
    book_validations_1.BookValidations.getRecentlyViewedBooksValidations,
  ),
  book_controller_1.BookController.getRecentlyViewedBooks,
);
router.get(
  '/discount/:percentage',
  book_controller_1.BookController.getBooksBasedOnDiscount,
);
router.get(
  '/related-books/:bookId',
  book_controller_1.BookController.getRelatedBooks,
);
router.get(
  '/free-delivery',
  book_controller_1.BookController.getFreeDeliveryBooks,
);
router.get('/:bookId', book_controller_1.BookController.getBook);
router.post(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    book_validations_1.BookValidations.createBookValidation,
  ),
  book_controller_1.BookController.createBook,
);
router.post(
  '/multiple',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  book_controller_1.BookController.createMultipleBooks,
);
router.post(
  '/pause-book/:bookId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  book_controller_1.BookController.pauseBook,
);
router.post(
  '/unpause-book/:bookId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  book_controller_1.BookController.unpauseBook,
);
router.put(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    book_validations_1.BookValidations.updateBookValidation,
  ),
  book_controller_1.BookController.updateBook,
);
router.delete('/:bookId', book_controller_1.BookController.deleteBook);
exports.BookRouter = router;
