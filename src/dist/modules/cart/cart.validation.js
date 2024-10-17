'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CartValidation = void 0;
const zod_1 = require('zod');
const createCartItemValidation = zod_1.z.object({
  book: zod_1.z.string({ required_error: 'Book is required' }).min(22),
  quantity: zod_1.z.number({ required_error: 'Quantity is required' }).min(1),
});
const updateCartItemQuantityValidation = zod_1.z.object({
  itemId: zod_1.z
    .string({ required_error: 'Cart Item id is required' })
    .min(22),
  quantity: zod_1.z.number({ required_error: 'Quantity is required' }).min(1),
});
exports.CartValidation = {
  createCartItemValidation,
  updateCartItemQuantityValidation,
};
