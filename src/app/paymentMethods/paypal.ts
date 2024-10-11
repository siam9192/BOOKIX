import paypal from 'paypal-rest-sdk';
import config from '../config';
import { Request, Response } from 'express';
import AppError from '../Errors/AppError';

paypal.configure({
  mode: 'sandbox',
  client_id: config.paypal_id as string,
  client_secret: config.paypal_secret as string,
});

export const pay = async (res: Response, amount: number, paymentId: string) => {
  const paymentJson: any = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${config.backend_base_api}/orders/payment/paypal/success?orderPaymentId=${paymentId}`,
      cancel_url: `${config.backend_base_api}/orders/payment/cancel?paymentId=${paymentId}`,
    },
    transactions: [
      {
        amount: {
          total: amount,
          currency: 'USD',
        },
        description: 'Your order will be placed after after the payment',
      },
    ],
  };

  paypal.payment.create(paymentJson, (error, payment) => {
    if (error) {
      throw new Error();
    } else {
      if (payment?.links) {
        payment.links.forEach((link) => {
          if (link.rel === 'approval_url') {
            res.send(link.href);
          }
        });
      }
    }
  });
};

const executePayment = async (
  paymentId: string,
  payerId: string,
  callFun: (saleId: string) => void | any,
) => {
  paypal.payment.execute(
    paymentId,
    { payer_id: payerId },
    function (error, payment: any) {
      if (error) {
        throw new Error();
      } else {
        const paymentTransactions = payment.transactions[0];
        if (
          paymentTransactions &&
          paymentTransactions.related_resources?.length
        ) {
          const saleId = paymentTransactions.related_resources[0].sale.id;
          if (saleId) {
            try {
              callFun(saleId);
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    },
  );
};

const refund = (
  saleId: string,
  amount: number,
  redirect_url?: string,
  res?: Response,
) => {
  const data = {
    amount: {
      total: amount.toFixed(2),
      currency: 'USD',
    },
  };
  try {
    paypal.sale.refund(saleId, data, function (error, refund) {
      if (error) {
        // throw new Error()
        throw new AppError(400, 'Something went wrong');
      } else {
        if (res && redirect_url) {
          res.redirect(redirect_url);
        }
      }
    });
  } catch (error) {
    if (res && redirect_url) {
      res.redirect(redirect_url);
    }
    // throw new AppError(400,"Something went wrong")
  }
};

export const Paypal = {
  pay,
  executePayment,
  refund,
};
