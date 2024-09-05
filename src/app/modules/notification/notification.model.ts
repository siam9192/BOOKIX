import { model, Schema } from 'mongoose';
import { TNotification } from './notification.interface';

const notificationSchema = new Schema<TNotification>({
  title: { type: String, required: true },
  description: { type: String, default: null },
  link: { type: String, default: null },
  icon: { type: String, default: null },
});

export const Notification = model<TNotification>(
  'Notification',
  notificationSchema,
);
