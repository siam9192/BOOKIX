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
exports.UserController = void 0;
const http_status_1 = __importDefault(require('http-status'));
const user_service_1 = require('./user.service');
const response_1 = require('../../utils/response');
const catchAsync_1 = __importDefault(require('../../utils/catchAsync'));
const getUsers = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getUsers(req.query);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'Users retrieved successfully',
      data: result,
    });
  }),
);
const getUser = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getUser(req.params.userId);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'Users retrieved successfully',
      data: result,
    });
  }),
);
const getCurrentUser = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield user_service_1.UserService.getUser(userId);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'User retrieved successfully',
      data: result,
    });
  }),
);
const changeUserBlockStatusIntoDB = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.changeUserBlockStatusIntoDB(
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'User block status changed successfully successfully',
      data: result,
    });
  }),
);
const changeUserRole = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.changeUserRoleIntoDB(
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'User role changed successfully successfully',
      data: result,
    });
  }),
);
exports.UserController = {
  getUsers,
  getUser,
  changeUserBlockStatusIntoDB,
  changeUserRole,
  getCurrentUser,
};
