import mongoose, { Schema, Document } from 'mongoose';
import {
  TAddress,
  TBillingDetails,
  TContact,
  TDeliveryDetails,
  TOrder,
  TOrderStatus,
} from './order.interface';

const contactSchema = new Schema<TContact>({
  name: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
  },
});

const addressSchema = new Schema<TAddress>({
  street_address: {
    type: String,
    required: true,
  },
  apartment_number: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  county: {
    type: String,
    required: true,
  },
});

const billingDetailsSchema = new Schema<TBillingDetails>({
  biller: {
    type: contactSchema,
    required: true,
  },
  billing_address: {
    type: addressSchema,
    required: true,
  },
});

const deliveryDetailsSchema = new Schema<TDeliveryDetails>({
  delivery_address: {
    type: addressSchema,
    required: true,
  },
  recipient: {
    type: contactSchema,
    required: true,
  },
  billing_details: {
    type: billingDetailsSchema,
    default: null,
  },
});

const orderSchema = new Schema<TOrder>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    unit_price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
    },
    delivery_details: {
      type: deliveryDetailsSchema,
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TOrderStatus),
      required: true,
    },
    isReviewed: {
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

export const Order = mongoose.model<TOrder>('Order', orderSchema);
