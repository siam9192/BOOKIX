import { Types } from 'mongoose';
import { TName } from '../user/user.interface';

// 1. Contact Details
export type TContact = {
  name: TName;
  phone: string;
  email?: string;
};

export type TRecipient = TContact;
type TBiller = TContact;

// 2. Address Information
export type TAddress = {
  street_address: string;
  apartment_number: string;
  city: string;
  state: string;
  county: string;
};

export type TBillingAddress = TAddress;
type TDeliveryAddress = TAddress & { recipient: TRecipient };

export // 3. Billing Details
type TBillingDetails = {
  biller: TBiller;
  billing_address: TBillingAddress;
};

export type TDeliveryDetails = {
  recipient: TRecipient;
  delivery_address: TDeliveryAddress;
  billing_details?: TBillingDetails;
};

// 5. Payment Method Enum

export enum TOrderStatus {
  PENDING = 'Pending', // The order has been received but not yet processed
  PROCESSING = 'Processing', // The order is currently being prepared or packed
  IN_TRANSIT = 'InTransit', // The order is on its way to the destination
  OUT_FOR_DELIVERY = 'OutForDelivery', // The order is out for delivery and expected to arrive soon
  DELIVERED = 'Delivered', // The order has been successfully delivered
  RETURNED = 'Returned', // The order has been returned by the recipient
  CANCELLED = 'Cancelled', // The order has been cancelled and will not be delivered
}
export type TOrderBook = {
  book: Types.ObjectId;
  unit_price: number;
  quantity: number;
  is_reviewed?: boolean;
}
// 7. Order Information
export type TOrder = {
  books: TOrderBook[];
  delivery_details: TDeliveryDetails;
  payment: Types.ObjectId;
  status: (typeof TOrderStatus)[keyof typeof TOrderStatus];
  is_paid: boolean;
  user: Types.ObjectId;
};
