import { z } from 'zod';

const createCartItemValidation = z.object({
  book: z.string({ required_error: 'Book is required' }).min(22),
  quantity: z.number({ required_error: 'Quantity is required' }).min(1),
});

const updateCartItemQuantityValidation = z.object({
  itemId: z.string({ required_error: 'Cart Item id is required' }).min(22),
  quantity: z.number({ required_error: 'Quantity is required' }).min(1),
});

export const CartValidation = {
  createCartItemValidation,
  updateCartItemQuantityValidation,
};
