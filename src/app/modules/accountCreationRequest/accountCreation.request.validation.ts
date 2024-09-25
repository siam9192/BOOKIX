import { z } from 'zod';
import { TRole } from '../user/user.interface';
const createAccountCreationRequestValidation = z.object({
  name: z.object({
    first_name: z.string(),
    middle_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
  role: z.enum(Object.values(TRole) as [string, ...string[]]),
  email: z.string().email(),
  password: z.string(),
});

const verifyOtpValidations = z.object({
  secret: z.string(),
  otp: z.string(),
});
const resendOtpValidation = z.object({
  secret: z.string(),
  requestTime: z.string(),
});

export const AccountCreationRequestValidations = {
  createAccountCreationRequestValidation,
  verifyOtpValidations,
  resendOtpValidation,
};
