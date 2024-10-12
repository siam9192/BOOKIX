"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const amountSchema = new mongoose_1.Schema({
    subtotal: {
        type: Number,
        required: true,
    },
    delivery_charge: {
        type: Number,
        min: 0,
        required: true,
    },
    discount: {
        type: Number,
        min: 0,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
});
const paymentSchema = new mongoose_1.Schema({
    transaction_id: {
        type: String,
        required: true,
    },
    intent_id: {
        type: String,
        select: 0,
        default: null,
    },
    payment_method: {
        type: String,
        enum: Object.values(payment_interface_1.TPaymentMethod),
        required: true,
    },
    amount: {
        type: amountSchema,
        required: true,
    },
    coupon: {
        type: String,
        default: null,
    },
    success: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
