'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.WishBookRouter = void 0;
const express_1 = require('express');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const wishBook_validation_1 = require('./wishBook.validation');
const wishBook_controller_1 = require('./wishBook.controller');
const router = (0, express_1.Router)();
router.post(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.CUSTOMER,
    user_interface_1.TRole.MODERATOR,
    user_interface_1.TRole.ADMIN,
  ),
  (0, validateRequest_1.default)(
    wishBook_validation_1.WiseBookValidations.createWiseBookValidation,
  ),
  wishBook_controller_1.WishBookController.createWiseBook,
);
router.get(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.CUSTOMER,
    user_interface_1.TRole.MODERATOR,
    user_interface_1.TRole.ADMIN,
  ),
  wishBook_controller_1.WishBookController.getWishBooks,
);
router.delete(
  '/:wishBookId',
  (0, auth_1.default)(
    user_interface_1.TRole.CUSTOMER,
    user_interface_1.TRole.MODERATOR,
    user_interface_1.TRole.ADMIN,
  ),
  wishBook_controller_1.WishBookController.deleteWiseBook,
);
exports.WishBookRouter = router;
