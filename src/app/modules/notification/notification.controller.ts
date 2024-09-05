import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.createNotificationIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Notification created successfully',
    data: result,
  });
});

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await NotificationService.getUserNotificationsFromDB(userId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Notifications retrieved  successfully',
    data: result,
  });
});

const makeAsReadNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result =
      await NotificationService.makeAsReadNotificationsIntoDB(userId);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Notifications make as read successfully',
      data: result,
    });
  },
);

export const NotificationController = {
  createNotification,
  getUserNotifications,
  makeAsReadNotifications,
};
