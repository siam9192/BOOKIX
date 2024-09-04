import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { objectId } from '../../utils/func';
import { Book } from '../book/book.model';
import { TPaymentMethod, TPaymentMethodUnion } from '../payment/payment.interface';
import { Stripe } from '../../paymentMethods/stripe';
import { Order } from './order.model';
import { Payment } from '../payment/payment.model';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { startSession } from 'mongoose';
import { TDeliveryDetails } from './order.interface';
import { idText } from 'typescript';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { Paypal } from '../../paymentMethods/paypal';
import { Response } from 'express';

const createOrderIntoDB = async (
  res:Response,
  userId: string,
  payload: {
    books: { bookId: string; quantity: number }[];
    delivery_details: TDeliveryDetails;
    coupon?: string;
    payment_method: TPaymentMethodUnion;
  },
) => {
  const bookObjectIds = payload.books.map((book) => objectId(book.bookId));
  const books = await Book.find({ _id: { $in: bookObjectIds } });

  //  Checking is get all books correctly
  if (books.length !== payload.books.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }
  console.log(books)

  const purchasedBooks: any[] = [];

  payload.books.forEach((book) => {
    const foundedBook = books.find(
      (dbBook) => dbBook._id.toString() === book.bookId,
    );

    if (!foundedBook) {
      throw new AppError(httpStatus.NOT_FOUND, `Book not found`);
    }

    // Checking is user demanded number of quantity books available in stock
    else if (foundedBook.available_stock < book.quantity) {
      throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Stock not available');
    } else if (foundedBook.is_paused || foundedBook.is_deleted) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `Currently ${foundedBook.name} is not available to purchase`,
      );
    }
    const bookData = {
      book: foundedBook._id,
      name: foundedBook.name,
      image: foundedBook.cover_images[0],
      quantity: book.quantity,
      unit_price: foundedBook.price.enable_discount_price
        ? foundedBook.price.discount_price
        : foundedBook.price,
      free_delivery: foundedBook.free_delivery || false,
    };
    purchasedBooks.push(bookData);
  });

  let success_url;
  let cancel_url = 'http://localhost:5173/';

  // Calculating total amount
  let total = 0;
  let subtotal = 0;
  let delivery_charge = 0;

  purchasedBooks.forEach((item) => {
    total += item.unit_price * item.quantity;
    subtotal += item.unit_price * item.quantity;
    // Checking is the book has free delivery service
    if (!item.free_delivery) {
      total += 3;
      delivery_charge += 3;
    }
  });

  const amount = {
    subtotal,
    delivery_charge,
    total,
  };

  const paymentData = {
    transaction_id: 'ST' + crypto.randomBytes(8).toString('hex'),
    payment_method: payload.payment_method,
    intent_id: crypto.randomBytes(8).toString('hex'),
    amount,
    coupon: payload.coupon || null,
    user: userId,
  };

  const session = await startSession();
  session.startTransaction();
  try {
    const payment = await Payment.create([paymentData], { session: session });
    if (!payment || !payment[0]) {
      throw new Error();
    }

    success_url = `http://localhost:5000/api/v1/orders/payment-success?paymentId=${payment[0]._id.toString()}`;
    
    const orderData = {
      books:purchasedBooks.map(book=>({
        book: book.book,
        quantity: book.quantity,
        unit_price: book.unit_price,
      })),
      delivery_details: payload.delivery_details,
      payment: payment[0]._id,
      user: userId,
    }

    const order = await Order.create(orderData)
     if(!order){
    throw new Error()
     }

     let paymentUrl;
     await session.commitTransaction();
     await session.endSession();

   switch(payload.payment_method){
    case TPaymentMethod.PAYPAL:
    paymentUrl = await Paypal.pay(res,total,payment[0]._id.toString())
    break
     case TPaymentMethod.STRIPE :
      paymentUrl = await Stripe.pay({
        books:purchasedBooks,
        success_url,
        cancel_url
      })
      break
   }

   
   

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Something went wrong');
  }
};

const managePaymentSuccessOrdersIntoDB = async (paymentId: string,payment_method?:TPaymentMethodUnion) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Something went wrong');
  }

  const updatePayment = await Payment.updateOne(
    { _id: payment._id },
    { success: true },
  );
  if (!updatePayment.modifiedCount) {
    throw new AppError(400, 'Order unsuccess full');
  }
 const orderedBooks = await Order.findOneAndUpdate({ payment: objectId(paymentId)},{is_paid:true},{new:true}).select('books');
 if(orderedBooks){
  Promise.all(orderedBooks.books.map(item=> Book.findByIdAndUpdate(item.book,{$inc:{available_stock:-item.quantity}})))
 }
  return true;
};

const managePaypalPaymentSuccessOrdersIntoDB = async (res:Response,query:{PayerID:string,paymentId:string,orderPaymentId:string}) => {
  const manageOrder = async(saleId:string)=>{
    const payment = await Payment.findById(query.orderPaymentId);
console.log(payment)
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Something went wrong');
  }

  const session = await startSession()
  session.startTransaction()

  try {
    const updatePayment = await Payment.updateOne(
      { _id: payment._id },
      { success: true },
    );
    if (!updatePayment.modifiedCount) {
      throw new Error()
    }
   const orderedBooks = await Order.findOneAndUpdate({ payment: objectId(query.orderPaymentId)},{is_paid:true},{new:true,session}).select('books');
   if(orderedBooks){
    Promise.all(orderedBooks.books.map(item=> Book.findByIdAndUpdate(item.book,{$inc:{available_stock:-item.quantity}},{session})))
    .catch(err=>{
      throw new Error();
    })
   }
    session.commitTransaction()
    session.endSession

    res.redirect('https://www.youtube.com/watch?v=1xyPf6Rm2Nw')
    
  } catch (error) {

    session.abortTransaction()
    session.endSession()

    // Finding an error and refund the payed amount  to payer
    Paypal.refund(saleId,payment.amount.subtotal)
  }
  }
  
  // Executing payment 
  Paypal.executePayment(query.paymentId,query.PayerID,manageOrder)
  
};

const getOrdersFromDB = async (query: any) => {
  const result = await Order.aggregate([
    {
      $lookup:{
        from:'payments',
        localField:'payment',
        foreignField:'_id',
        as:"payment"
      }
    },
    {
      $addFields:{
          payment:{
            $arrayElemAt: [ "$payment", 0 ] 
          }
      }
    },
    {
   $match:{
    'payment.success':true
   }
    },
    {
     $sort:{
      createdAt:-1
     }
    },
    {
      $limit:5
    },
  ])
  
  return result
};

export const OrderService = {
  createOrderIntoDB,
  managePaymentSuccessOrdersIntoDB,
  managePaypalPaymentSuccessOrdersIntoDB,
  getOrdersFromDB
};
