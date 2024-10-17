'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthorRouter = void 0;
const express_1 = require('express');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const author_validation_1 = require('./author.validation');
const author_controller_1 = require('./author.controller');
const router = (0, express_1.Router)();
router.post(
  '/',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    author_validation_1.AuthorValidations.createAuthorValidation,
  ),
  author_controller_1.AuthorController.createAuthor,
);
router.get('/', author_controller_1.AuthorController.getAuthors);
router.get('/popular', author_controller_1.AuthorController.getPopularAuthors);
router.get('/:authorId', author_controller_1.AuthorController.getAuthor);
router.patch(
  '/:authorId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  (0, validateRequest_1.default)(
    author_validation_1.AuthorValidations.updateAuthorValidation,
  ),
  author_controller_1.AuthorController.updateAuthor,
);
router.delete(
  '/:authorId',
  (0, auth_1.default)(
    user_interface_1.TRole.ADMIN,
    user_interface_1.TRole.MODERATOR,
  ),
  author_controller_1.AuthorController.deleteAuthor,
);
exports.AuthorRouter = router;
