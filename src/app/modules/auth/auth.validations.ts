import { z } from 'zod';

const loginValidation = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Enter valid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 character'),
});
const forgetPasswordRequestValidation = z.object({
  email: z.string().email(),
});

const resetPasswordValidation = z.object({
  token: z.string(),
  new_password: z.string().min(6),
});

export const changePasswordValidation = z.object({
  current_password: z.string().min(6),
  new_password: z.string().min(6),
});

const newAccessTokenRequestValidationRequest = z.object({
  refreshToken: z.string(),
});

export const googleCallbackValidation = z.object({
  accessToken: z.string({ required_error: 'Access token is required' }),
});

// const google
export const AuthValidations = {
  googleCallbackValidation,
  loginValidation,
  forgetPasswordRequestValidation,
  resetPasswordValidation,
  changePasswordValidation,
  newAccessTokenRequestValidationRequest,
};
