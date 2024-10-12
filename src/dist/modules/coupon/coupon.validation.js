"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponValidations = void 0;
const zod_1 = require("zod");
const coupon_interface_1 = require("./coupon.interface");
const createCouponValidation = zod_1.z.object({
    coupon_code: zod_1.z.string(),
    description: zod_1.z.string(),
    discount_amount: zod_1.z.number(),
    discount_type: zod_1.z.enum(Object.values(coupon_interface_1.TCouponDiscountType)),
    valid_from: zod_1.z.string().datetime(),
    valid_until: zod_1.z.string().datetime(),
    minimum_purchase_amount: zod_1.z.number(),
    applicable_categories: zod_1.z
        .union([zod_1.z.array(zod_1.z.string()), zod_1.z.literal('**')])
        .optional(),
    specific_customers: zod_1.z
        .union([zod_1.z.array(zod_1.z.string()), zod_1.z.literal('**')])
        .optional(),
    usage_limit: zod_1.z.union([zod_1.z.number(), zod_1.z.literal('unlimited')]),
    terms_and_conditions: zod_1.z.string(),
});
const updateCouponValidation = createCouponValidation.partial();
const applyCouponValidation = zod_1.z.object({
    code: zod_1.z.string(),
    items: zod_1.z.array(zod_1.z.object({
        book: zod_1.z.string(),
        quantity: zod_1.z.number().min(1),
    })),
});
exports.CouponValidations = {
    createCouponValidation,
    updateCouponValidation,
    applyCouponValidation,
};
