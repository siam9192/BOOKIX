"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidations = void 0;
const zod_1 = require("zod");
// Zod schema for TNotification
const notificationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    link: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
// Zod schema for TNotificationRequestBody
const createNotificationValidation = zod_1.z.object({
    notification: notificationSchema,
    users: zod_1.z.union([zod_1.z.literal('**'), zod_1.z.array(zod_1.z.string())]),
    view_global: zod_1.z.boolean(),
});
// Export the schemas if needed
exports.NotificationValidations = {
    createNotificationValidation,
};
