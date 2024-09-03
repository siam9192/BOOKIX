import paypal from 'paypal-rest-sdk';
import config from '../config';

paypal.configure({
    mode:'sandbox',
    client_id:config.paypal_id as string,
    client_secret:config.paypal_secret as string
})

export const payWithPaypal = ()=>{
    const paymentJson:any = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal'
        },
        redirect_urls: {
          return_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/cancel'
        },
        transactions: [{
          amount: {
            total:100,
            currency: 'USD'
          },
          description: 'Payment description'
        }]
      };
      paypal.payment.create(paymentJson, (error, payment) => {
        if (error) {
        console.log(error)
        } else {
       if(payment?.links){
        console.log(payment?.links[1]?.href)

       }         
        }
      });
      
}