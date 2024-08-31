import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import { accountRequestService } from './accountCreation.request.service';
import httpStatus from 'http-status';

const accountRegistrationRequest = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    console.log(payload);
    const result =
      await accountRequestService.createAccountRequestIntoDB(payload);

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Otp code just has been send to your email',
      data: result,
    });
  },
);

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await accountRequestService.verifyOtpFromDB(payload);
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
