import { Types } from 'mongoose';

export enum TPaymentMethod {
  STRIPE = 'Stripe',
  PAYPAL = 'Paypal',
}
export type TPaymentMethodUnion =
  (typeof TPaymentMethod)[keyof typeof TPaymentMethod];

export type TPayment = {
  transaction_id: string;
  payment_method: keyof typeof TPaymentMethod;
  intent_id: string;
  amount: {
    subtotal: number;
    discount: number;
    delivery_charge: number;
    total: number;
  };
  coupon: string;
  success: boolean;
  order: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
