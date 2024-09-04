import config from '../config';

const stripe = require('stripe')(config.stripe_secret);

type TData = {
  books: {
    name: string;
    image: string;
    quantity: number;
    unit_price: number;
    free_delivery: boolean;
  }[];
  success_url: string;
  cancel_url: string;
};

export const pay = async (data: TData) => {
  const line_items: any = data.books.map((item) => {
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
    if (!item.free_delivery) deliveryCharge += 3;
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

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: data.success_url,
    cancel_url: data.cancel_url,
  });
  const paymentIntentId = session.payment_intent;
  const url = session.url;
  return url;
};

export const refund = async (paymentIntentId: string, amount: number) => {
  // Function to handle refund
  try {
    // Create a refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
    });

    console.log('Refund successful:', refund);
    return refund;
  } catch (error) {
    console.error('Error creating refund:', error);
    throw error;
  }
};

export const Stripe = {
  pay,
  refund,
};
