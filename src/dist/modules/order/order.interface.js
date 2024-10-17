'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TOrderStatus = void 0;
// 5. Payment Method Enum
var TOrderStatus;
(function (TOrderStatus) {
  TOrderStatus['PENDING'] = 'Pending';
  TOrderStatus['PROCESSING'] = 'Processing';
  TOrderStatus['IN_TRANSIT'] = 'InTransit';
  TOrderStatus['OUT_FOR_DELIVERY'] = 'OutForDelivery';
  TOrderStatus['DELIVERED'] = 'Delivered';
  TOrderStatus['RETURNED'] = 'Returned';
  TOrderStatus['CANCELLED'] = 'Cancelled';
})(TOrderStatus || (exports.TOrderStatus = TOrderStatus = {}));
