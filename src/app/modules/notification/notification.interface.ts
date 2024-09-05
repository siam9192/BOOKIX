import { Types } from "mongoose";

export type TNotification = {
  title: string;
  description?: string;
  link?: string;
  icon?: string;
};

export type TNotificationRequestBody = {
  notification: TNotification;
  users: '**' | string[];
  view_global?: boolean;
};
