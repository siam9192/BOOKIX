'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importStar(require('mongoose'));
const coupon_interface_1 = require('./coupon.interface');
const couponSchema = new mongoose_1.Schema({
  coupon_code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  discount_amount: { type: Number, required: true },
  discount_type: {
    type: String,
    enum: Object.values(coupon_interface_1.TCouponDiscountType),
    required: true,
  },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  minimum_purchase_amount: { type: Number, required: true },
  applicable_categories: {
    type: mongoose_1.Schema.Types.Mixed,
    validate: {
      validator: function (value) {
        return (
          value === '**' ||
          value.every((category) => typeof category === 'string')
        );
      },
      message: 'Invalid category format',
    },
    default: '**',
  },
  specific_customers: {
    type: mongoose_1.Schema.Types.Mixed,
    validate: {
      validator: function (value) {
        return (
          value === '**' ||
          value.every((customer) => typeof customer === 'string')
        );
      },
      message: 'Invalid customer format',
    },
    default: '**',
  },
  usage_limit: {
    type: mongoose_1.Schema.Types.Mixed, // Allows either number or string
    validate: {
      validator: function (value) {
        return value === 'unlimited' || typeof value === 'number';
      },
      message: 'Invalid usage limit format',
    },
    default: 'unlimited',
  },
  terms_and_conditions: { type: String, required: true },
});
const Coupon = mongoose_1.default.model('Coupon', couponSchema);
exports.default = Coupon;
