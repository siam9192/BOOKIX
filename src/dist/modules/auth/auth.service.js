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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const accountCreation_request_service_1 = require('../accountCreationRequest/accountCreation.request.service');
const user_interface_1 = require('../user/user.interface');
const user_model_1 = require('../user/user.model');
const bycrypt_1 = require('../../utils/bycrypt');
const func_1 = require('../../utils/func');
const config_1 = __importDefault(require('../../config'));
const user_service_1 = require('../user/user.service');
const sendEmail_1 = require('../../utils/sendEmail');
const axios_1 = __importDefault(require('axios'));
const googleCallback = (_a) =>
  __awaiter(
    void 0,
    [_a],
    void 0,
    function* ({ accessToken: googleAccessToken }) {
      try {
        const { data } = yield axios_1.default.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
            },
          },
        );
        let tokenPayload;
        const user = yield user_model_1.User.findOne({ email: data.email });
        // Checking user existence if user found then generate refresh token and access token otherwise create a user and then  generate refresh token and access token
        if (user) {
          tokenPayload = {
            id: user._id,
            role: user.role,
          };
        } else {
          const userData = {
            email: data.email,
            google_id: data.id,
            registered_by: user_interface_1.TRegistrationOption.GOOGLE_AUTH,
          };
          const user = yield user_model_1.User.create(userData);
          tokenPayload = {
            id: user.id,
            role: user.role,
          };
        }
        // Generating access token
        const accessToken = yield (0, func_1.generateJwtToken)(
          tokenPayload,
          config_1.default.jwt_access_secret,
          '30d',
        );
        // Generating refresh token
        const refreshToken = yield (0, func_1.generateJwtToken)(
          tokenPayload,
          config_1.default.jwt_refresh_token_secret,
          config_1.default.jwt_refresh_token_expire_time,
        );
        return {
          accessToken,
          refreshToken,
        };
      } catch (error) {
        throw new AppError_1.default(400, 'Something went wrong');
      }
    },
  );
const googleCallback1 = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
      email: payload.email,
      registered_by: user_interface_1.TRegistrationOption.GOOGLE_AUTH,
    });
    const tokenPayload = {
      id: user === null || user === void 0 ? void 0 : user._id,
      role: user === null || user === void 0 ? void 0 : user.role,
    };
    //  if user  not exist than create new user and finally return important tokens
    if (!user) {
      const user = yield user_service_1.UserService.createUserIntoDB(
        payload,
        user_interface_1.TRegistrationOption.GOOGLE_AUTH,
      );
      if (!user) {
        throw new AppError_1.default(400, 'Something went wrong');
      }
      tokenPayload.id = user === null || user === void 0 ? void 0 : user._id;
      tokenPayload.role = user === null || user === void 0 ? void 0 : user.role;
    }
    // Generating access token
    const accessToken = yield (0, func_1.generateJwtToken)(
      tokenPayload,
      config_1.default.jwt_access_secret,
      '30d',
    );
    // Generating refresh token
    const refreshToken = yield (0, func_1.generateJwtToken)(
      tokenPayload,
      config_1.default.jwt_refresh_token_secret,
      config_1.default.jwt_refresh_token_expire_time,
    );
    return {
      accessToken,
      refreshToken,
    };
  });
const signUpRequest = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield accountCreation_request_service_1.AccountCreationRequestService.initiateAccountCreation(
      payload,
    );
  });
const signUpVerify = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield accountCreation_request_service_1.AccountCreationRequestService.verifyOtpFromDB(
      payload,
    );
  });
const resendOtp = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield accountCreation_request_service_1.AccountCreationRequestService.resendOtp(
      payload,
    );
  });
const login = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
      email: payload.email,
    }).select(['password', 'role']);
    // Checking user existence
    if (!user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Account not found',
      );
    }
    // Comparing password
    const isMatched = yield (0, bycrypt_1.bcryptCompare)(
      payload.password,
      user.password,
    );
    // Checking is password correct
    if (!isMatched) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Wrong password',
      );
    }
    const tokenPayload = {
      id: user._id,
      role: user.role,
    };
    // Generating access token
    const accessToken = yield (0, func_1.generateJwtToken)(
      tokenPayload,
      config_1.default.jwt_access_secret,
      '30d',
    );
    // Generating refresh token
    const refreshToken = yield (0, func_1.generateJwtToken)(
      tokenPayload,
      config_1.default.jwt_refresh_token_secret,
      config_1.default.jwt_refresh_token_expire_time,
    );
    return {
      accessToken,
      refreshToken,
    };
  });
const changePasswordIntoDB = (userId, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select('password');
    // Checking user existence
    if (!user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'User not found',
      );
    }
    const matchPassword = (0, bycrypt_1.bcryptCompare)(
      payload.current_password,
      user === null || user === void 0 ? void 0 : user.password,
    );
    if (!matchPassword) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'You entered wrong current password',
      );
    }
    // Hashed new password using bcrypt
    const hashedNewPassword = yield (0, bycrypt_1.bcryptHash)(
      payload.new_password,
    );
    const result = yield user_model_1.User.updateOne(
      { _id: user._id },
      { password: hashedNewPassword },
    );
    // Checking is the password updated successfully
    if (!result.modifiedCount) {
      throw new AppError_1.default(400, 'Password could not be changed');
    }
    return true;
  });
const forgetPassword = (email) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
      email: email,
      registered_by: user_interface_1.TRegistrationOption.EMAIL,
    });
    // Checking user existence
    if (!user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'No account found on this email',
      );
    }
    const payload = {
      email: user.email,
    };
    const token = (0, func_1.generateJwtToken)(
      payload,
      config_1.default.jwt_forget_password_token_secret,
      config_1.default.jwt_forget_password_token_expire_time,
    );
    yield (0, sendEmail_1.sendResetPasswordMail)(user.email, token);
  });
const resetPasswordFromForgetPasswordRequest = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const decode = (0, func_1.verifyToken)(
      payload.token,
      config_1.default.jwt_forget_password_token_secret,
    );
    if (!decode) {
      throw new AppError_1.default(400, 'Something went  wrong');
    }
    const user = yield user_model_1.User.findOne({
      email: decode.email,
      registered_by: user_interface_1.TRegistrationOption.EMAIL,
    });
    // Checking user existence
    if (!user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'User Not found',
      );
    }
    // Hashed new  password
    const hashedNewPassword = yield (0, bycrypt_1.bcryptHash)(
      payload.new_password,
    );
    const updatePassword = yield user_model_1.User.updateOne(
      { email: user.email },
      { password: hashedNewPassword },
    );
    if (!updatePassword.modifiedCount) {
      throw new AppError_1.default(
        400,
        'Password can not be changed some thing went wrong!',
      );
    }
  });
const getAccessTokenByRefreshToken = (userId, refreshToken) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const decode = (0, func_1.verifyToken)(
        refreshToken,
        config_1.default.jwt_refresh_token_secret,
      );
      if (!decode) {
        throw new Error();
      }
      if (userId !== decode.id) {
        throw new Error();
      }
      const user = yield user_model_1.User.findById(decode.id);
      if (!user) {
        throw new Error();
      }
      const tokenPayload = {
        id: user._id,
        role: user.role,
      };
      // Generating access token
      const accessToken = (0, func_1.generateJwtToken)(
        tokenPayload,
        config_1.default.jwt_access_secret,
        '30d',
      );
      return {
        accessToken,
      };
    } catch (error) {
      throw new AppError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'You are unauthorized!',
      );
    }
  });
exports.AuthService = {
  googleCallback,
  signUpRequest,
  signUpVerify,
  resendOtp,
  login,
  changePasswordIntoDB,
  forgetPassword,
  resetPasswordFromForgetPasswordRequest,
  getAccessTokenByRefreshToken,
};
