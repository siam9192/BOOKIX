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
Object.defineProperty(exports, '__esModule', { value: true });
exports.OverviewService = void 0;
const func_1 = require('../../utils/func');
const order_interface_1 = require('../order/order.interface');
const order_model_1 = require('../order/order.model');
const user_model_1 = require('../user/user.model');
const getCustomerAccountOverViewFromDB = (userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({
      customer: (0, func_1.objectId)(userId),
    });
    const bookYetToReview = yield order_model_1.Order.aggregate([
      {
        $match: {
          customer: (0, func_1.objectId)(userId),
          status: order_interface_1.TOrderStatus.DELIVERED,
        },
      },
      {
        $unwind: '$items',
      },
      {
        $project: {
          order: '$items',
        },
      },
      {
        $match: {
          'order.is_reviewed': false,
        },
      },
    ]);
    const userWithNotifications =
      yield user_model_1.User.findById(userId).select('notifications');
    const order_to_ship_count = orders.filter(
      (order) => order.status === order_interface_1.TOrderStatus.IN_TRANSIT,
    ).length;
    const order_delivered_count = orders.filter(
      (order) => order.status === order_interface_1.TOrderStatus.IN_TRANSIT,
    ).length;
    const book_to_review_count = bookYetToReview.length;
    const notification_count =
      (userWithNotifications === null || userWithNotifications === void 0
        ? void 0
        : userWithNotifications.notifications.length) || 0;
    return {
      order_to_ship_count,
      order_delivered_count,
      book_to_review_count,
      notification_count,
    };
  });
exports.OverviewService = {
  getCustomerAccountOverViewFromDB,
};
