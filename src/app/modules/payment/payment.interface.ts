import { Types } from 'mongoose';

export enum TPaymentMethod {
  STRIPE = 'Stripe',
  PAYPAL = 'Paypal',
}
export type TPayment = {
  trx_id: string;
  payment_method: keyof typeof TPaymentMethod;
  total: number;
  discount: number;
  delivery_charge: number;
  vat: number;
  coupon: string;
  success: boolean;
  order: Types.ObjectId;
  user: Types.ObjectId;
};
