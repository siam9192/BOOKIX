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
    data: result.data,
    meta: result.meta,
  });
});

const getCurrentUserPaymentHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await PaymentService.getUserPaymentHistoryFromDB(
      userId,
      req.query,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Payments retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  },
);
const getUserPaymentHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await PaymentService.getUserPaymentHistoryFromDB(
      userId,
      req.query,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Payments retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  },
);

export const PaymentController = {
  getPayments,
  getCurrentUserPaymentHistory,
  getUserPaymentHistory,
};
