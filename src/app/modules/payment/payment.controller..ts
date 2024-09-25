import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { PaymentService } from './payment.service';

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPaymentsFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

export const PaymentController = {
  getPayments,
};
