import { startSession, Types } from 'mongoose';
import AppError from '../../Errors/AppError';
import { User } from '../user/user.model';
import { TReview } from './review.interface';
import { Review } from './review.model';
import httpStatus from 'http-status';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { Order } from '../order/order.model';
import { TOrderStatus } from '../order/order.interface';
import { objectId } from '../../utils/func';

const createReviewIntoDB = async (userId: string, payload: TReview) => {
  const order = await Order.findById(payload.order).populate('items');

  // checking order existence
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  } else if (order.status === TOrderStatus.CANCELLED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Review can not possible of this order',
    );
  } else if (order.status !== TOrderStatus.DELIVERED) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Without complete the  delivery of the  review can not possible of this books',
    );
  }

  const orderedBooks = order.items.map((item) => item.book.toString());

  // Checking is the book purchase on this order
  if (!orderedBooks.includes(payload.book.toString())) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'With out purchase the book review can not possible',
    );
  }

  const isReviewed = order.items.find(
    (item) => item.book.toString() === payload.book.toString(),
  )?.is_reviewed;

  if (isReviewed) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Book is already reviewed');
  }

  payload.customer = objectId(userId);

  const session = await startSession();
  session.startTransaction();

  try {
    const updateResult = await Order.updateOne(
      { _id: order._id, 'items.book': objectId(payload.book.toString()) },
      { 'items.$.is_reviewed': true },
      { session },
    );

    if (!updateResult.modifiedCount) {
      throw new Error();
    }

    //  Checking is review created successfully
    const createdReview = await Review.create([payload], { session });

    if (!createdReview) {
      throw new Error();
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, 'Review can not created something went wrong');
  }
};

const deleteReviewFromDB = async (reviewId: string) => {
  const result = await Review.deleteOne({ _id: objectId(reviewId) });
  if (!result.deletedCount) {
    throw new AppError(402, 'Delete unsuccessful');
  }
  return true;
};

const getBookReviewsFromDB = async (bookId: string, query: any) => {
  query.book = objectId(bookId);
  let data: any = await new QueryBuilder(Review.find(), query)
    .find()
    .paginate()
    .populate('customer')
    .get();
  const meta = await new QueryBuilder(Review.find(), query)
    .find()
    .paginate()
    .populate('customer')
    .getMeta();

  data = data.map((item: any) => {
    const doc = item._doc;
    const name = doc.customer.name;

    return {
      _id: doc._id,
      images: doc.images,
      rating: doc.rating,
      comment: doc.comment,
      customer: {
        // Concat customer name
        full_name:
          name.first_name +
          (name.middle_name ? ` ${name.middle_name}` : '') +
          (name.last_name ? ` ${name.last_name}` : ''),
      },
      createdAt: doc.createdAt || new Date(),
    };
  });

  return {
    data,
    meta,
  };
};

const updateReviewIntoDB = async (
  reviewId: string,
  payload: Pick<TReview, 'images' | 'rating' | 'comment'>,
) => {
  const review = await Review.findById(reviewId);

  // Checking review existence
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }
  return await Review.findByIdAndUpdate(reviewId, payload, {
    runValidators: true,
    new: true,
  });
};

export const ReviewService = {
  createReviewIntoDB,
  deleteReviewFromDB,
  getBookReviewsFromDB,
  updateReviewIntoDB,
};
