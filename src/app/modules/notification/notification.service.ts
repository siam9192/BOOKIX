import AppError from '../../Errors/AppError';
import { User } from '../user/user.model';
import { TNotificationRequestBody } from './notification.interface';
import { Notification } from './notification.model';
import { objectId } from '../../utils/func';

const createNotificationIntoDB = async (payload: TNotificationRequestBody) => {
  const notification = await Notification.create(payload.notification);
  if (payload.users && Array.isArray(payload.users)) {
    payload.users.forEach(async (userId) => {
      await User.findByIdAndUpdate(userId, {
        $push: { notifications: { notification: notification._id } },
      });
    });
  } else if(payload.users === '**') {
    await User.updateMany({}, { $push: { notifications: notification._id } });
  }
  else {
    throw new AppError(400,'Something went wrong')
  }
};

const getUserNotificationsFromDB = async (userId: string) => {
  const result = await User.findById(userId)
    .select('notifications')
    .populate('notifications.notification');
  return result?.notifications.reverse();
};

const makeAsReadNotificationsIntoDB = async (userId: string) => {
  const result = await User.findOneAndUpdate(
    {
      _id:objectId(userId)
    }
    ,
    { 'notifications.$[].read': true },
    { runValidators: true,new:true },
  ).select('notifications').populate('notifications.notification');
  return result
};

export const NotificationService = {
  createNotificationIntoDB,
  getUserNotificationsFromDB,
  makeAsReadNotificationsIntoDB,
};
