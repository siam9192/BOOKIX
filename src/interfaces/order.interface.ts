import { Types } from 'mongoose';
import { TName } from '../app/modules/user/user.interface';

export type TRecipient = {
  name: TName;
  phone: string;
  email?: string;
};
export type TBiller = {
  name: TName;
  phone: string;
  email?: string;
};
export type TBillingAddress = {
  street_address: string;
  apartment_number: string;
  city: string;
  state: string;
  county: string;
};

export type TBillingDetails = {
  biller: TBiller;
  billing_address: TBillingAddress;
};

export type TDeliveryAddress = {
  street_address: string;
  apartment_number: string;
  city: string;
  state: string;
  county: string;
  recipient: TRecipient;
};

export type TDeliveryDetails = {
  delivery_address: TDeliveryAddress;
  billing_details?: TBillingDetails;
};

// Main order type
export type TOrder = {
  book: Types.ObjectId;
  unit_price: number;
  quantity: number;
  delivery_details: TDeliveryDetails;
  payment: Types.ObjectId;
  user: Types.ObjectId;
};
