'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthRouter = void 0;
const express_1 = require('express');
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const accountCreation_request_validation_1 = require('../accountCreationRequest/accountCreation.request.validation');
const auth_controller_1 = require('./auth.controller');
const auth_validations_1 = require('./auth.validations');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_interface_1 = require('../user/user.interface');
const router = (0, express_1.Router)();
router.post(
  '/google-callback',
  (0, validateRequest_1.default)(
    auth_validations_1.AuthValidations.googleCallbackValidation,
  ),
  auth_controller_1.AuthController.handelGoogleCallback,
);
router.post(
  '/signup-request',
  (0, validateRequest_1.default)(
    accountCreation_request_validation_1.AccountCreationRequestValidations
      .createAccountCreationRequestValidation,
  ),
  auth_controller_1.AuthController.handelSignupRequest,
);
router.post(
  '/signup-request/resend-otp',
  (0, validateRequest_1.default)(
    accountCreation_request_validation_1.AccountCreationRequestValidations
      .resendOtpValidation,
  ),
  auth_controller_1.AuthController.handelResendRequest,
);
router.post(
  '/signup-request/verify',
  auth_controller_1.AuthController.handelSignupVerify,
);
router.post(
  '/login',
  (0, validateRequest_1.default)(
    auth_validations_1.AuthValidations.loginValidation,
  ),
  auth_controller_1.AuthController.handelLogin,
);
router.post(
  '/forget-password',
  (0, validateRequest_1.default)(
    auth_validations_1.AuthValidations.forgetPasswordRequestValidation,
  ),
  auth_controller_1.AuthController.forgetPassword,
);
router.patch(
  '/change-password',
  (0, auth_1.default)(...Object.values(user_interface_1.TRole)),
  (0, validateRequest_1.default)(
    auth_validations_1.AuthValidations.changePasswordValidation,
  ),
  auth_controller_1.AuthController.changePassword,
);
router.patch(
  '/forget-password/reset-password',
  (0, validateRequest_1.default)(
    auth_validations_1.AuthValidations.resetPasswordValidation,
  ),
  auth_controller_1.AuthController.resetPasswordFromForgetPasswordRequest,
);
router.get(
  '/new-access-token',
  (0, auth_1.default)(...Object.values(user_interface_1.TRole)),
  auth_controller_1.AuthController.getNewAccessTokenByRefreshToken,
);
exports.AuthRouter = router;
