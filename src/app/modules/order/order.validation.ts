import { z } from 'zod';
import { TPaymentMethod } from '../payment/payment.interface';
const contactSchema = z.object({
  name: z.object({
    first_name: z.string(),
    last_name: z.string(),
  }),
  phone: z.string(),
  email: z.string().optional(),
});

// Define schema for address information
const addressSchema = z.object({
  street_address: z.string(),
  apartment_number: z.string(),
  city: z.string(),
  state: z.string(),
  county: z.string(),
});

// Define schema for billing details
const billingDetailsSchema = z.object({
  biller: contactSchema,
  billing_address: addressSchema,
});

// Define schema for delivery details
const deliveryDetailsSchema = z.object({
  recipient: contactSchema,
  delivery_address: addressSchema,
  billing_details: billingDetailsSchema.optional(),
});
const paymentMethodUnion = z.union(
  Object.values(TPaymentMethod).map((item) => z.literal(item)) as any,
);

const bookSchema = z.object({
  bookId: z.string().nonempty('Book ID cannot be empty'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const createOrderValidation = z.object({
  books: z.array(bookSchema).nonempty('At least one book must be provided'),
  coupon: z.string().optional(),
  payment_method: paymentMethodUnion,
  delivery_details: deliveryDetailsSchema,
});

export const OrderValidations = {
  createOrderValidation,
};