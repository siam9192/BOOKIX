import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { objectId } from '../../utils/func';
import { Book } from '../book/book.model';
import { TPaymentMethodUnion } from '../payment/payment.interface';
import { Order } from './order.model';
import { Payment } from '../payment/payment.model';
import crypto from 'crypto';
import { startSession } from 'mongoose';
import { TDeliveryDetails, TOrder, TOrderStatus } from './order.interface';
import { Paypal } from '../../paymentMethods/paypal';
import { Response } from 'express';
import Coupon from '../coupon/coupon.model';
import { TCouponDiscountType } from '../coupon/coupon.interface';
import { NotificationService } from '../notification/notification.service';
const createOrderIntoDB = async (
  res: Response,
  userId: string,
  payload: {
    items: { bookId: string; quantity: number }[];
    delivery_details: TDeliveryDetails;
    customer_message:string;
    coupon?: string;
    payment_method: TPaymentMethodUnion;
  },
) => {
  const bookObjectIds = payload.items.map((book) => objectId(book.bookId));
  const books = await Book.find({ _id: { $in: bookObjectIds } });

  //  Checking is get all books correctly
  if (books.length !== payload.items.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }

  const purchasedBooks: any[] = [];

  payload.items.forEach((book) => {
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
    discount: 0,
    total,
  };

  if (payload.coupon) {
    const coupon = await Coupon.findOne({coupon_code:payload.coupon});
    const currentDate = new Date();
    // Checking coupon existence
    if (!coupon) {
      throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
    }
    // Checking coupon apply requirements

    if (coupon.specific_customers !== '**') {
      if (!coupon.specific_customers.includes(userId)) {
        throw new AppError(
          httpStatus.NOT_ACCEPTABLE,
          'Coupon can not be applied',
        );
      }
    } else if (coupon.applicable_categories !== '**') {
      books.forEach((book) => {
        if (!coupon.applicable_categories.includes(book.category)) {
          throw new AppError(
            httpStatus.NOT_ACCEPTABLE,
            `Coupon cannot be applied on ${book.category}`,
          );
        }
      });
    }

    // Checking coupon validity
    else if (currentDate < new Date(coupon.valid_from)) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `This coupon can not be use before ${new Date(coupon.valid_from).toDateString()}`,
      );
    }
    // Checking coupon validity
    else if (currentDate > new Date(coupon.valid_until)) {
      throw new AppError(httpStatus.NOT_ACCEPTABLE, `The coupon is expired`);
    } else if (coupon.minimum_purchase_amount > amount.total) {
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        `This coupon can be applied on minimum $ ${coupon.minimum_purchase_amount} purchase`,
      );
    }
    // Applying coupon on price based on coupon type
    if (coupon.discount_type === TCouponDiscountType.FIXED) {
      amount.total = amount.total - coupon.discount_amount;
      amount.discount = coupon.discount_amount;
    } else {
      const discount = (amount.total / 100) * coupon.discount_amount;
      amount.total = amount.total - discount;
      amount.discount = discount;
    }
  }

  const paymentData = {
    transaction_id: 'PP' + crypto.randomBytes(8).toString('hex').toUpperCase(),
    payment_method: payload.payment_method,
    amount,
    coupon: payload.coupon || null,
    user: userId,
  };

  // Session for transaction and rollback
  const session = await startSession();
  session.startTransaction();
  try {
    const payment = await Payment.create([paymentData], { session: session });
    if (!payment || !payment[0]) {
      throw new Error();
    }

    const orderData:any = {
      items: purchasedBooks.map((book) => ({
        book: book.book,
        quantity: book.quantity,
        unit_price: book.unit_price,
      })),
      delivery_details: payload.delivery_details,
      payment: payment[0]._id,
      customer: userId,
    };

    if(payload.customer_message){
      orderData.customer_message =payload.customer_message
    }

    // Creating order into db
    const order = await Order.create([orderData], { session });

    // Checking is the order successfully created in the database
    if (!order[0]) {
      throw new Error();
    }

    await session.commitTransaction();
    await session.endSession();

    await Paypal.pay(res, amount.total, payment[0]._id.toString());
  } catch (error) {
    console.log(error)
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Something went wrong');
  }
};

const managePaymentSuccessOrdersIntoDB = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);

  //  Checking payment existence
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Something went wrong');
  }

  // Updating payment success status false to true
  const updatePayment = await Payment.updateOne(
    { _id: payment._id },
    { success: true },
  );

  // Checking is the payment successfully updated
  if (!updatePayment.modifiedCount) {
    throw new AppError(400, 'Order unsuccessful');
  }

  // Updating order paid status
  const orderedBooks = await Order.findOneAndUpdate(
    { payment: objectId(paymentId) },
    { is_paid: true },
    { new: true },
  ).select('books');

  // Updating books available_stock
  if (orderedBooks) {
    Promise.all(
      orderedBooks.items.map((item) =>
        Book.findByIdAndUpdate(item.book, {
          $inc: { available_stock: -item.quantity },
        }),
      ),
    );
  }
  return true;
};

// Manage order after successful payment
const managePaypalPaymentSuccessOrdersIntoDB = async (
  res: Response,
  query: { PayerID: string; paymentId: string; orderPaymentId: string },
) => {
  console.log(query)
  const manageOrder = async (saleId: string) => {
    const payment = await Payment.findById(query.orderPaymentId);

    //  Checking payment existence
    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Something went wrong');
    }

    const session = await startSession();
    session.startTransaction();

    try {
      // Updating payment success status false to true
      const updatePayment = await Payment.updateOne(
        { _id: payment._id },
        { success: true, intent_id: saleId },
      );

      // Checking is the payment successfully updated
      if (!updatePayment.modifiedCount) {
        throw new Error();
      }
   

      // Updating order paid status
      const orderedBooks = await Order.findOneAndUpdate(
        { payment: objectId(query.orderPaymentId) },
        { is_paid: true },
        { new: true, session },
      ).select('items');

      // Updating books available_stock
      if (orderedBooks) {
        await Promise.all(
          orderedBooks.items.map((item) =>
            Book.findByIdAndUpdate(
              item.book,
              { $inc: { available_stock: -item.quantity } },
              { session },
            ),
          ),
        ).catch((err) => {
          throw new Error();
        });
      }

      await NotificationService.createNotificationIntoDB({
        notification: {
          title: 'Your order successfully placed`',
          description:
            'Thanks for your order.We will deliver your order as soon as possible',
        },
        users: [payment.user.toString()],
      });
      await session.commitTransaction();
      session.endSession;

      res.redirect('https://www.youtube.com/watch?v=1xyPf6Rm2Nw');
    } catch (error) {
      console.log(error)
      await session.abortTransaction();
      session.endSession();

      // Found an error and refund the payed amount  to payer
      Paypal.refund(saleId, payment.amount.subtotal);
    }
  };

  // Executing payment
  Paypal.executePayment(query.paymentId, query.PayerID, manageOrder);
};

// Manage order after cancel payment
const managePaymentCanceledOrderIntoDB = async (paymentId: string) => {
  await Order.findOneAndDelete({ payment: objectId(paymentId) });
  await Payment.findByIdAndDelete(paymentId);
};

const getOrdersFromDB = async (query: any) => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: 'items',
        localField: 'items.book',
        foreignField: '_id',
        as: 'payment',
      },
    },
    {
      $lookup: {
        from: 'payments',
        localField: 'payment',
        foreignField: '_id',
        as: 'payment',
      },
    },
    {
      $addFields: {
        payment: {
          $arrayElemAt: ['$payment', 0],
        },
      },
    },
    {
      $match: {
        'payment.success': true,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  return result;
};

const updateOrderStatus = async (
  payload: Pick<TOrder, 'status'> & { orderId: string },
) => {
  const order: any = await Order.findById(payload.orderId).populate('payment');

  //  Checking order existence
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Checking order payment status
  if (!order.payment.success) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Status can not be change of this order ',
    );
  }
  const orderStatus = order.status;

  if (
    orderStatus === TOrderStatus.PENDING &&
    payload.status !== TOrderStatus.PROCESSING
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      `Order status can not be change Pending to ${payload.status}`,
    );
  } else if (
    orderStatus === TOrderStatus.PROCESSING &&
    payload.status !== TOrderStatus.IN_TRANSIT
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      `Order status can not be change Processing to ${payload.status}`,
    );
  } else if (
    orderStatus === TOrderStatus.IN_TRANSIT &&
    payload.status !== TOrderStatus.OUT_FOR_DELIVERY
  ) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      `Order status can not be change InTransit to ${payload.status}`,
    );
  } else if (orderStatus === TOrderStatus.DELIVERED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Delivered order status can not be update',
    );
  } else if (orderStatus === TOrderStatus.RETURNED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Order status can not be change',
    );
  } else if (orderStatus === TOrderStatus.CANCELLED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Order status can not be change',
    );
  }

  const result = await Order.findByIdAndUpdate(
    payload.orderId,
    { status: payload.status },
    { new: true },
  ).select('status');
  return result;
};

const getCustomerYetToReviewOrdersFromDB = async (userId: string) => {
  const result = await Order.aggregate([
    {
      $match: {
        customer: objectId(userId),
        status: TOrderStatus.DELIVERED,
      },
    },
    {
      $unwind: '$books',
    },
    {
      $project: {
        order: '$books',
      },
    },
    {
      $match: {
        'order.is_reviewed': false,
      },
    },
    {
      $lookup: {
        from: 'books',
        localField: 'order.book',
        foreignField: '_id',
        as: 'order.book',
      },
    },
    {
      $project: {
        'order.book': {
          name: 1,
          cover_images: 1,
        },
        'order.quantity': 1,
        'order.unit_price': 1,
      },
    },
  ]);

  return result;
};

export const OrderService = {
  createOrderIntoDB,
  managePaymentSuccessOrdersIntoDB,
  managePaypalPaymentSuccessOrdersIntoDB,
  getOrdersFromDB,
  updateOrderStatus,
  managePaymentCanceledOrderIntoDB,
  getCustomerYetToReviewOrdersFromDB,
};
