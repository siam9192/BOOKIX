import { model, Schema } from 'mongoose';
import { TPayment, TPaymentMethod } from './payment.interface';

const amountSchema = new Schema({
  subtotal: {
    type: Number,
    required: true,
  },
  delivery_charge: {
    type: Number,
    min: 0,
    required: true,
  },

  discount: {
    type: Number,
    min: 0,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

const paymentSchema = new Schema<TPayment>(
  {
    transaction_id: {
      type: String,
      required: true,
    },
    intent_id: {
      type: String,
      select: 0,
      default: null,
    },
    payment_method: {
      type: String,
      enum: Object.values(TPaymentMethod),
      required: true,
    },
    amount: {
      type: amountSchema,
      required: true,
    },
    coupon: {
      type: String,
      default: null,
    },
    success: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   
  },
  {
    timestamps: true,
  },
);

export const Payment = model<TPayment>('Payment', paymentSchema);
