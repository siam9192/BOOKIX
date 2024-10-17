'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.NotificationService = void 0;
const AppError_1 = __importDefault(require('../../Errors/AppError'));
const user_model_1 = require('../user/user.model');
const notification_model_1 = require('./notification.model');
const func_1 = require('../../utils/func');
const createNotificationIntoDB = (payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield notification_model_1.Notification.create(
      payload.notification,
    );
    if (payload.users && Array.isArray(payload.users)) {
      payload.users.forEach((userId) =>
        __awaiter(void 0, void 0, void 0, function* () {
          yield user_model_1.User.findByIdAndUpdate(userId, {
            $push: { notifications: { notification: notification._id } },
          });
        }),
      );
    } else if (payload.users === '**') {
      yield user_model_1.User.updateMany(
        {},
        { $push: { notifications: notification._id } },
      );
    } else {
      throw new AppError_1.default(400, 'Something went wrong');
    }
  });
const getUserNotificationsFromDB = (userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(userId)
      .select('notifications')
      .populate('notifications.notification');
    return result === null || result === void 0
      ? void 0
      : result.notifications.reverse();
  });
const makeAsReadNotificationsIntoDB = (userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOneAndUpdate(
      {
        _id: (0, func_1.objectId)(userId),
      },
      { 'notifications.$[].read': true },
      { runValidators: true, new: true },
    )
      .select('notifications')
      .populate('notifications.notification');
    return result;
  });
exports.NotificationService = {
  createNotificationIntoDB,
  getUserNotificationsFromDB,
  makeAsReadNotificationsIntoDB,
};
