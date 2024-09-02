import mongoose, {Schema } from 'mongoose';
import { TCoupon } from './coupon.interface';



const couponSchema: Schema = new Schema<TCoupon>({
  coupon_code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  discount_amount: { type: Number, required: true },
  discount_type: { type: String, enum: ['percentage', 'fixed'], required: true },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  minimum_purchase_amount: { type: Number, required: true },
  applicable_categories: { 
    type: [String], 
    validate: {
      validator: function(value: string[] | '**') {
        return value === '**' || value.every(category => typeof category === 'string');
      },
      message: 'Invalid category format'
    },
    default: '**'
  },
  specific_customers: { 
    type: [String], 
    validate: {
      validator: function(value: string[] | '**') {
        return value === '**' || value.every(customer => typeof customer === 'string');
      },
      message: 'Invalid customer format'
    },
    default: '**'
  },
  usage_limit: { 
    type: Schema.Types.Mixed, // Allows either number or string
    validate: {
      validator: function(value: number | 'unlimited') {
        return value === 'unlimited' || typeof value === 'number';
      },
      message: 'Invalid usage limit format'
    },
    default: 'unlimited'
  },
  terms_and_conditions: { type: String, required: true }
});

const Coupon = mongoose.model<TCoupon>('Coupon', couponSchema);

export default Coupon;
