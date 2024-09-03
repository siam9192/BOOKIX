import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id
  const result = await OrderService.createOrderIntoDB(userId,req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully',
    data: result,
  });
});

const managePaymentSuccessOrders = (async (req: Request, res: Response) => {
  const orderId = req.query.paymentId
  const result = await OrderService.managePaymentSuccessOrdersIntoDB(orderId as string);
  // sendSuccessResponse(res, {
  //   statusCode: httpStatus.CREATED,
  //   message: 'Order payment successfully',
  //   data: result,
  // });
  res.redirect('https://www.youtube.com/watch?v=1xyPf6Rm2Nw')
});

export const OrderController = {
    createOrder,
    managePaymentSuccessOrders
}