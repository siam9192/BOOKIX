import { z } from 'zod';


const createCouponValidation = z.object({
  coupon_code: z.string(),
  description: z.string(),
  discount_amount: z.number(),
  discount_type: z.enum(['percentage', 'fixed']),
  valid_from: z.string().datetime(),
  valid_until: z.string().datetime(),
  minimum_purchase_amount: z.number(),
  applicable_categories: z.union([z.array(z.string()), z.literal('**')]),
  specific_customers: z.union([z.array(z.string()), z.literal('**')]),
  usage_limit: z.union([z.number(), z.literal('unlimited')]),
  terms_and_conditions: z.string()
});


const updateCouponValidation = createCouponValidation.partial()


export const CouponValidations = {
  createCouponValidation,
  updateCouponValidation
}
