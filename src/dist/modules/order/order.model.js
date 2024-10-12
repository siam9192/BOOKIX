"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const order_interface_1 = require("./order.interface");
const contactSchema = new mongoose_1.Schema({
    name: {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
    },
});
const addressSchema = new mongoose_1.Schema({
    street_address: {
        type: String,
        required: true,
    },
    apartment_number: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});
const billingDetailsSchema = new mongoose_1.Schema({
    biller: {
        type: contactSchema,
        required: true,
    },
    billing_address: {
        type: addressSchema,
        required: true,
    },
});
const deliveryDetailsSchema = new mongoose_1.Schema({
    delivery_address: {
        type: addressSchema,
        required: true,
    },
    recipient: {
        type: contactSchema,
        required: true,
    },
    billing_details: {
        type: billingDetailsSchema,
        default: null,
    },
});
const orderBookSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    unit_price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        min: 0,
        required: true,
    },
    is_reviewed: {
        type: Boolean,
        default: false,
    },
});
const orderSchema = new mongoose_1.Schema({
    items: {
        type: [orderBookSchema],
        required: true,
    },
    delivery_details: {
        type: deliveryDetailsSchema,
        required: true,
    },
    customer_message: {
        type: String,
        default: null,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(order_interface_1.TOrderStatus),
        default: order_interface_1.TOrderStatus.PENDING,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.Order = mongoose_1.default.model('Order', orderSchema);
