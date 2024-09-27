import { z } from 'zod';
import { TCouponDiscountType } from './coupon.interface';

const createCouponValidation = z.object({
  coupon_code: z.string(),
  description: z.string(),
  discount_amount: z.number(),
  discount_type: z.enum(Object.values(TCouponDiscountType) as any),
  valid_from: z.string().datetime(),
  valid_until: z.string().datetime(),
  minimum_purchase_amount: z.number(),
  applicable_categories: z
    .union([z.array(z.string()), z.literal('**')])
    .optional(),
  specific_customers: z
    .union([z.array(z.string()), z.literal('**')])
    .optional(),
  usage_limit: z.union([z.number(), z.literal('unlimited')]),
  terms_and_conditions: z.string(),
});

const updateCouponValidation = createCouponValidation.partial();

const applyCouponValidation = z.object({
   code:z.string(),
   items:z.array(z.object({ 
    book:z.string(),
    quantity:z.number().min(1)}))
})

export const CouponValidations = {
  createCouponValidation,
  updateCouponValidation,
  applyCouponValidation
};
