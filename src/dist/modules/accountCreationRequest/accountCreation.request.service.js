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
exports.AccountCreationRequestService = void 0;
const http_status_1 = __importDefault(require('http-status'));
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const user_model_1 = require('../user/user.model');
const func_1 = require('../../utils/func');
const config_1 = __importDefault(require('../../config'));
const bycrypt_1 = require('../../utils/bycrypt');
const accountCreation_request_model_1 = require('./accountCreation.request.model');
const sendEmail_1 = require('../../utils/sendEmail');
const mongoose_1 = require('mongoose');
const user_service_1 = require('../user/user.service');
const user_interface_1 = require('../user/user.interface');
const initiateAccountCreation = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    // Checking user existence
    if (user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'User is already exists on this email',
      );
    }
    // Hashing password to secure it
    payload.password = yield (0, bycrypt_1.bcryptHash)(payload.password);
    // Generating otp
    const otp = (0, func_1.generateOTP)(6);
    // Hashing otp to secure it
    payload.otp = yield (0, bycrypt_1.bcryptHash)(otp);
    // Saving account details minimum for 5 minute
    const result =
      yield accountCreation_request_model_1.AccountCreationRequest.create(
        payload,
      );
    // after successfully saving the details sending the verification mail to the user given email
    if (result) {
      yield (0, sendEmail_1.sendEmailVerificationMail)(payload.email, otp);
    }
    const tokenPayload = {
      id: result._id,
      email: payload.email,
    };
    // Generating jwt token for verify otp code
    const token = (0, func_1.generateJwtToken)(
      tokenPayload,
      config_1.default.jwt_ac_verify_secret,
      '10m',
    );
    return {
      secret: token,
    };
  });
const verifyOtpFromDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // Decoding jwt token
    const decode = (0, func_1.verifyToken)(
      payload.secret,
      config_1.default.jwt_ac_verify_secret,
    );
    if (!decode) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Invalid request',
      );
    }
    // Finding data
    const data =
      yield accountCreation_request_model_1.AccountCreationRequest.findOne({
        _id: (0, func_1.objectId)(decode.id),
      });
    if (!data) {
      throw new AppError_1.default(400, 'OTP expired!');
    }
    const verifyOtp = yield (0, bycrypt_1.bcryptCompare)(payload.otp, data.otp);
    // Verifying otp
    if (!verifyOtp) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Wrong otp',
      );
    }
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };
    // Creating user after successfully verified
    const createdUser = yield user_service_1.UserService.createUserIntoDB(
      userData,
      user_interface_1.TRegistrationOption.EMAIL,
    );
    // Deleting account request data
    yield accountCreation_request_model_1.AccountCreationRequest.deleteOne(
      { _id: new mongoose_1.Types.ObjectId(data._id), email: data.email },
      { session },
    );
    //When user creation is unsuccessful then
    if (!createdUser) {
      session.abortTransaction();
    } else {
      session.commitTransaction();
      return createdUser;
    }
    session.endSession();
    throw new AppError_1.default(400, 'Something went wrong');
  });
const resendOtp = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    // Decoding jwt token
    const decode = (0, func_1.verifyToken)(
      payload.secret,
      config_1.default.jwt_ac_verify_secret,
    );
    if (!decode) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Invalid request',
      );
    }
    const accountCreationRequest =
      yield accountCreation_request_model_1.AccountCreationRequest.findOne({
        _id: (0, func_1.objectId)(decode.id),
        // email: decode.email,
      });
    // Checking request existence
    if (!accountCreationRequest) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        'Time expired',
      );
    }
    // Difference between request time and previous otp send time
    const difference =
      (new Date(payload.requestTime || new Date()).valueOf() -
        new Date(accountCreationRequest.updatedAt).valueOf()) /
      1000;
    // If difference less  than 120 seconds  than  resend otp can not be possible
    if (difference < 120) {
      throw new AppError_1.default(
        http_status_1.default.NOT_ACCEPTABLE,
        'Can not be able to resend otp before 2 minutes ',
      );
    }
    // Generating new otp code
    const newOtp = (0, func_1.generateOTP)(6);
    // Hashing otp
    const hashedOtp = yield (0, bycrypt_1.bcryptHash)(newOtp);
    // Updating otp
    const updatedAccountCreationRequest =
      yield accountCreation_request_model_1.AccountCreationRequest.findOneAndUpdate(
        { _id: new mongoose_1.Types.ObjectId(decode.id), email: decode.email },
        { otp: hashedOtp },
        { new: true, runValidators: true },
      );
    // Checking is otp updated successfully
    if (!updatedAccountCreationRequest) {
      throw new AppError_1.default(
        400,
        'Something went wrong please try again',
      );
    }
    yield (0, sendEmail_1.sendEmailVerificationMail)(
      updatedAccountCreationRequest.email,
      newOtp,
    );
    return true;
  });
exports.AccountCreationRequestService = {
  initiateAccountCreation,
  verifyOtpFromDB,
  resendOtp,
};
