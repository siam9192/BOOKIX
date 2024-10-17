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
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require('../../utils/catchAsync'));
const auth_service_1 = require('./auth.service');
const response_1 = require('../../utils/response');
const http_status_1 = __importDefault(require('http-status'));
const handelGoogleCallback = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.googleCallback(req.body);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'Login successful',
      data: result,
    });
  }),
);
const handelSignupRequest = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.signUpRequest(req.body);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: '6 digit Otp has been send to your email',
      data: result,
    });
  }),
);
const handelResendRequest = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.resendOtp(req.body);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: '6 digit Otp has been send to your email',
      data: null,
    });
  }),
);
const handelSignupVerify = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.signUpVerify(req.body);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'Account verification successful',
      data: result,
    });
  }),
);
const handelLogin = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.login(req.body);
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'Login in successful',
      data: result,
    });
  }),
);
const changePassword = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield auth_service_1.AuthService.changePasswordIntoDB(
      userId,
      req.body,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'Password changed  successfully',
      data: result,
    });
  }),
);
const forgetPassword = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.forgetPassword(
      req.body.email,
    );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'Password reset link has been send to your email address',
      data: result,
    });
  }),
);
const resetPasswordFromForgetPasswordRequest = (0, catchAsync_1.default)(
  (req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const result =
        yield auth_service_1.AuthService.resetPasswordFromForgetPasswordRequest(
          req.body,
        );
      (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Password changed successfully',
        data: result,
      });
    }),
);
const getNewAccessTokenByRefreshToken = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const refreshToken = req.cookies['refresh-token'];
    const result =
      yield auth_service_1.AuthService.getAccessTokenByRefreshToken(
        userId,
        refreshToken,
      );
    (0, response_1.sendSuccessResponse)(res, {
      statusCode: http_status_1.default.OK,
      message: 'New access token has been given successfully',
      data: result,
    });
  }),
);
exports.AuthController = {
  handelGoogleCallback,
  handelSignupRequest,
  handelResendRequest,
  handelSignupVerify,
  handelLogin,
  changePassword,
  forgetPassword,
  resetPasswordFromForgetPasswordRequest,
  getNewAccessTokenByRefreshToken,
};
