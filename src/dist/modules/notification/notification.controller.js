"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const response_1 = require("../../utils/response");
const notification_service_1 = require("./notification.service");
const createNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationService.createNotificationIntoDB(req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Notification created successfully',
        data: result,
    });
}));
const getUserNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield notification_service_1.NotificationService.getUserNotificationsFromDB(userId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Notifications retrieved  successfully',
        data: result,
    });
}));
const makeAsReadNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield notification_service_1.NotificationService.makeAsReadNotificationsIntoDB(userId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Notifications make as read successfully',
        data: result,
    });
}));
exports.NotificationController = {
    createNotification,
    getUserNotifications,
    makeAsReadNotifications,
};
