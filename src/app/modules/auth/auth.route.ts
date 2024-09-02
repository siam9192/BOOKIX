import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AccountCreationRequestValidations } from '../accountCreationRequest/accountCreation.request.validation';
import { AuthController } from './auth.controller';
import { AuthValidations } from './auth.validations';

const router = Router();

router.post(
  '/signup-request',
  validateRequest(
    AccountCreationRequestValidations.createAccountCreationRequestValidation,
  ),
  AuthController.handelSignupRequest,
);
router.post('/signup-request/resend-otp', AuthController.handelResendRequest);
router.post('/signup-request/verify', AuthController.handelSignupVerify);

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidation),
  AuthController.handelLogin,
);

export const AuthRouter = router;
