import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await OrderService.createOrderIntoDB(res,userId, req.body);
  // sendSuccessResponse(res, {
  //   statusCode: httpStatus.CREATED,
  //   message: 'Order created successfully',
  //   data: result,
  // });
});

const managePaymentSuccessOrders = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.query.paymentId;
  const result = await OrderService.managePaymentSuccessOrdersIntoDB(
    orderId as string,
  );
 
})

const managePaypalPaymentSuccessOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.managePaypalPaymentSuccessOrdersIntoDB(res,req.query as any)
});

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrdersFromDB(req.query)
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  managePaymentSuccessOrders,
  managePaypalPaymentSuccessOrders,
  getOrders
 
};
