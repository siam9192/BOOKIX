import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await OrderService.createOrderIntoDB(res, userId, req.body);
});

const managePaymentSuccessOrders = catchAsync(
  async (req: Request, res: Response) => {
    const orderId = req.query.paymentId;
    const result = await OrderService.managePaymentSuccessOrdersIntoDB(
      orderId as string,
    );
  },
);

const managePaypalPaymentSuccessOrders = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OrderService.managePaypalPaymentSuccessOrdersIntoDB(
      res,
      req.query as any,
    );
  },
);

const getOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.getOrdersFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getCurrentUserOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await OrderService.getCurrentUserOrdersFromDB(
    userId,
    req.query as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getUserOrderHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await OrderService.getUserOrderHistoryFromDB(
    userId,
    req.query as any,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User Order history retrieved successfully',
    data: result,
  });
});

const getCurrentUserOrderHistory = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await OrderService.getUserOrderHistoryFromDB(
      userId,
      req.query as any,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Order history retrieved successfully',
      data: result,
    });
  },
);

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.updateOrderStatus(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Orders status updated successfully',
    data: result,
  });
});

const managePaymentCanceledOrder = catchAsync(
  async (req: Request, res: Response) => {
    const paymentId = req.query.paymentId;
    const result = await OrderService.managePaymentCanceledOrderIntoDB(
      paymentId as string,
    );
    res.redirect('https://www.youtube.com/');
  },
);

const getCustomerYetToReviewOrders = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result =
      await OrderService.getCustomerYetToReviewOrdersFromDB(userId);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Yet to review order retrieved successfully',
      data: result,
    });
  },
);

const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const result = await OrderService.getOrderDetailsFromDB(orderId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order details retrieved successfully',
    data: result,
  });
});

const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const { id: userId, role: userRole } = req.user;
  const result = await OrderService.cancelOrderIntoDB(
    userId,
    userRole,
    orderId,
  );
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order cancelled successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  managePaymentSuccessOrders,
  managePaypalPaymentSuccessOrders,
  getOrders,
  updateOrderStatus,
  managePaymentCanceledOrder,
  getCustomerYetToReviewOrders,
  getCurrentUserOrders,
  getOrderDetails,
  cancelOrder,
  getCurrentUserOrderHistory,
  getUserOrderHistory,
};
