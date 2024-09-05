import { z } from 'zod';

// Zod schema for TNotification
const notificationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  link: z.string().optional(),
  icon: z.string().optional(),
});

// Zod schema for TNotificationRequestBody
const createNotificationValidation = z.object({
  notification: notificationSchema,
  users: z.union([z.literal('**'), z.array(z.string())]),
  view_global: z.boolean(),
});

// Export the schemas if needed

export const NotificationValidations = {
  createNotificationValidation,
};
