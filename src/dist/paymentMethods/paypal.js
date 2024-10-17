'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Paypal = exports.pay = void 0;
const paypal_rest_sdk_1 = __importDefault(require('paypal-rest-sdk'));
const config_1 = __importDefault(require('../config'));
const AppError_1 = __importDefault(require('../Errors/AppError'));
paypal_rest_sdk_1.default.configure({
  mode: 'sandbox',
  client_id: config_1.default.paypal_id,
  client_secret: config_1.default.paypal_secret,
});
const pay = (res, amount, paymentId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const paymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${config_1.default.backend_base_api}/orders/payment/paypal/success?orderPaymentId=${paymentId}`,
        cancel_url: `${config_1.default.backend_base_api}/orders/payment/cancel?paymentId=${paymentId}`,
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
    paypal_rest_sdk_1.default.payment.create(paymentJson, (error, payment) => {
      if (error) {
        throw new Error();
      } else {
        if (payment === null || payment === void 0 ? void 0 : payment.links) {
          payment.links.forEach((link) => {
            if (link.rel === 'approval_url') {
              res.send(link.href);
            }
          });
        }
      }
    });
  });
exports.pay = pay;
const executePayment = (paymentId, payerId, callFun) =>
  __awaiter(void 0, void 0, void 0, function* () {
    paypal_rest_sdk_1.default.payment.execute(
      paymentId,
      { payer_id: payerId },
      function (error, payment) {
        var _a;
        if (error) {
          throw new Error();
        } else {
          const paymentTransactions = payment.transactions[0];
          if (
            paymentTransactions &&
            ((_a = paymentTransactions.related_resources) === null ||
            _a === void 0
              ? void 0
              : _a.length)
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
  });
const refund = (saleId, amount, redirect_url, res) => {
  const data = {
    amount: {
      total: amount.toFixed(2),
      currency: 'USD',
    },
  };
  try {
    paypal_rest_sdk_1.default.sale.refund(
      saleId,
      data,
      function (error, refund) {
        if (error) {
          // throw new Error()
          throw new AppError_1.default(400, 'Something went wrong');
        } else {
          if (res && redirect_url) {
            res.redirect(redirect_url);
          }
        }
      },
    );
  } catch (error) {
    if (res && redirect_url) {
      res.redirect(redirect_url);
    }
    // throw new AppError(400,"Something went wrong")
  }
};
exports.Paypal = {
  pay: exports.pay,
  executePayment,
  refund,
};
