"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidations = void 0;
const zod_1 = require("zod");
const payment_interface_1 = require("../payment/payment.interface");
const order_interface_1 = require("./order.interface");
const contactSchema = zod_1.z.object({
    name: zod_1.z.object({
        first_name: zod_1.z.string(),
        last_name: zod_1.z.string(),
    }),
    phone: zod_1.z.string(),
    email: zod_1.z.string().optional(),
});
// Define schema for address information
const addressSchema = zod_1.z.object({
    street_address: zod_1.z.string(),
    apartment_number: zod_1.z.string(),
    city: zod_1.z.string(),
    state: zod_1.z.string(),
    country: zod_1.z.string(),
});
// Define schema for billing details
const billingDetailsSchema = zod_1.z.object({
    biller: contactSchema,
    billing_address: addressSchema,
});
// Define schema for delivery details
const deliveryDetailsSchema = zod_1.z.object({
    recipient: contactSchema,
    delivery_address: addressSchema,
    billing_details: billingDetailsSchema.optional(),
});
const paymentMethodUnion = zod_1.z.union(Object.values(payment_interface_1.TPaymentMethod).map((item) => zod_1.z.literal(item)));
const itemSchema = zod_1.z.object({
    bookId: zod_1.z.string().nonempty('Book ID cannot be empty'),
    quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
});
const createOrderValidation = zod_1.z.object({
    items: zod_1.z.array(itemSchema).nonempty('At least one book must be provided'),
    coupon: zod_1.z.string().optional(),
    payment_method: paymentMethodUnion,
    delivery_details: deliveryDetailsSchema,
    customer_message: zod_1.z.string().optional(),
});
const updateOrderStatusValidation = {
    orderId: zod_1.z.string(),
    status: zod_1.z.enum(Object.values(order_interface_1.TOrderStatus)),
};
exports.OrderValidations = {
    createOrderValidation,
    updateOrderStatusValidation,
};
