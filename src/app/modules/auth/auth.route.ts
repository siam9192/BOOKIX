import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AccountCreationRequestValidations } from '../accountCreationRequest/accountCreation.request.validation';
import { AuthController } from './auth.controller';
import { AuthValidations } from './auth.validations';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';

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
router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordRequestValidation),
  AuthController.forgetPassword,
);


router.patch(
  '/change-password',
  auth(...Object.values(TRole)),
  validateRequest(AuthValidations.changePasswordValidation),
  AuthController.changePassword,
);
router.patch(
  '/forget-password/reset-password',
  validateRequest(AuthValidations.resetPasswordValidation),
  AuthController.resetPasswordFromForgetPasswordRequest,
);

router.get('/new-access-token',auth(...Object.values(TRole)),AuthController.getNewAccessTokenByRefreshToken)



export const AuthRouter = router;
