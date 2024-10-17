'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthValidations =
  exports.googleCallbackValidation =
  exports.changePasswordValidation =
    void 0;
const zod_1 = require('zod');
const loginValidation = zod_1.z.object({
  email: zod_1.z
    .string({ required_error: 'Email is required' })
    .email('Enter valid email'),
  password: zod_1.z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 character'),
});
const forgetPasswordRequestValidation = zod_1.z.object({
  email: zod_1.z.string().email(),
});
const resetPasswordValidation = zod_1.z.object({
  token: zod_1.z.string(),
  new_password: zod_1.z.string().min(6),
});
exports.changePasswordValidation = zod_1.z.object({
  current_password: zod_1.z.string().min(6),
  new_password: zod_1.z.string().min(6),
});
const newAccessTokenRequestValidationRequest = zod_1.z.object({
  refreshToken: zod_1.z.string(),
});
exports.googleCallbackValidation = zod_1.z.object({
  accessToken: zod_1.z.string({ required_error: 'Access token is required' }),
});
// const google
exports.AuthValidations = {
  googleCallbackValidation: exports.googleCallbackValidation,
  loginValidation,
  forgetPasswordRequestValidation,
  resetPasswordValidation,
  changePasswordValidation: exports.changePasswordValidation,
  newAccessTokenRequestValidationRequest,
};
