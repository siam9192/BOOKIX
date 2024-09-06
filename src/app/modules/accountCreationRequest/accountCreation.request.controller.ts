import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { AccountCreationRequestService } from './accountCreation.request.service';

const accountRegistrationRequest = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result =
      await AccountCreationRequestService.initiateAccountCreation(payload);

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Otp code just has been send to your email',
      data: result,
    });
  },
);

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await AccountCreationRequestService.verifyOtpFromDB(payload);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Otp code just has been send to your email',
    data: result,
  });
});
export const accountRequestController = {
  accountRegistrationRequest,
  verifyOtp,
};
