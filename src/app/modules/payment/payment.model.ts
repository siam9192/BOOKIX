import { model, Schema } from 'mongoose';
import { TPayment, TPaymentMethod } from './payment.interface';

const paymentSchema = new Schema<TPayment>({
  trx_id: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    enum: Object.values(TPaymentMethod),
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  delivery_charge: {
    type: Number,
    min: 0,
    required: true,
  },
  vat: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    min: 0,
    default: 0,
  },
  coupon: {
    type: String,
    default: null,
  },
  success: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Payment = model<TPayment>('Payment', paymentSchema);
