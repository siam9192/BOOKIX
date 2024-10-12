"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_interface_1 = require("../user/user.interface");
const notification_controller_1 = require("./notification.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const notification_validation_1 = require("./notification.validation");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_interface_1.TRole.ADMIN, user_interface_1.TRole.MODERATOR), (0, validateRequest_1.default)(notification_validation_1.NotificationValidations.createNotificationValidation), notification_controller_1.NotificationController.createNotification);
router.get('/', (0, auth_1.default)(...Object.values(user_interface_1.TRole)), notification_controller_1.NotificationController.getUserNotifications);
router.patch('/make-as-read', (0, auth_1.default)(...Object.values(user_interface_1.TRole)), notification_controller_1.NotificationController.makeAsReadNotifications);
exports.NotificationRouter = router;
