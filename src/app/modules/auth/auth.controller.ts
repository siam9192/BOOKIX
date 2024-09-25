import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import config from '../../config';

const handelGoogleCallback = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.googleCallback(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: result,
  });
});
const handelSignupRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signUpRequest(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: '6 digit Otp has been send to your email',
    data: result,
  });
});

const handelResendRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resendOtp(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: '6 digit Otp has been send to your email',
    data: null,
  });
});

const handelSignupVerify = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signUpVerify(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Account verification successful',
    data: result,
  });
});

const handelLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Login in successful',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await AuthService.changePasswordIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password changed  successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgetPassword(req.body.email);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset link has been send to your email address',
    data: result,
  });
});

const resetPasswordFromForgetPasswordRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.resetPasswordFromForgetPasswordRequest(
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Password changed successfully',
      data: result,
    });
  },
);

const getNewAccessTokenByRefreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const refreshToken = req.cookies['refresh-token'];
    const result = await AuthService.getAccessTokenByRefreshToken(
      userId,
      refreshToken,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'New access token has been given successfully',
      data: result,
    });
  },
);

export const AuthController = {
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
