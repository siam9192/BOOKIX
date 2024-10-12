"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stripe = exports.refund = exports.pay = void 0;
const config_1 = __importDefault(require("../config"));
const stripe = require('stripe')(config_1.default.stripe_secret);
const pay = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const line_items = data.books.map((item) => {
        const x = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.unit_price * 100),
            },
            quantity: item.quantity,
        };
        return x;
    });
    // Calculating delivery charge
    let deliveryCharge = 0;
    data.books.forEach((item) => {
        if (!item.free_delivery)
            deliveryCharge += 3;
    });
    if (deliveryCharge) {
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Charge',
                },
                unit_amount: Math.round(deliveryCharge * 100),
            },
            quantity: 1,
        });
    }
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: total, // amount in cents
    //   currency: 'usd',
    //   // You can also add more options here if needed
    // });
    // console.log(paymentIntent)
    const session = yield stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url: data.success_url,
        cancel_url: data.cancel_url,
    });
    const paymentIntentId = session.payment_intent;
    const url = session.url;
    return url;
});
exports.pay = pay;
const refund = (paymentIntentId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    // Function to handle refund
    try {
        // Create a refund
        const refund = yield stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount,
        });
        console.log('Refund successful:', refund);
        return refund;
    }
    catch (error) {
        console.error('Error creating refund:', error);
        throw error;
    }
});
exports.refund = refund;
exports.Stripe = {
    pay: exports.pay,
    refund: exports.refund,
};
