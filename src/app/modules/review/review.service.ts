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

const createReviewIntoDB = async (userId:string,payload: TReview) => {
  const order = await Order.findById(payload.order).populate('books')

  // checking order existence

  if(!order){
    throw new AppError(httpStatus.NOT_FOUND,'Order not found')
  }
  else if(order.status === TOrderStatus.CANCELLED){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Review can not possible of this order')
  }
  else if(order.status !== TOrderStatus.DELIVERED){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'Without complete the  delivery of the  review can not possible of this books')
  }

  const orderedBooks = order.books.map(item=>item.book)
  
  // Checking is the book purchase on this order
  if(!orderedBooks.includes(payload.book)){
    throw new AppError(httpStatus.NOT_ACCEPTABLE,'With out purchase the book review can not possible')
  }
  payload.customer = objectId(userId)
 
 return  await Review.create(payload)
};

const deleteReviewFromDB = async (reviewId: string) => {
  const result = await Review.deleteOne({_id:objectId(reviewId)});
  if (!result.deletedCount) {
    throw new AppError(402, 'Delete unsuccessful');
  }
  return true;
};

const getBookReviewsFromDB = async (bookId: string, query: any) => {
  query.book = objectId(bookId)
  const result = await new QueryBuilder(Review.find(), query).find().paginate().populate('user').get();
  return result;
};

const updateReviewIntoDB = async (
  reviewId: string,
  payload: Pick<TReview, 'images' | 'rating' | 'comment'>,
) => {
  const review = await Review.findById(reviewId)

  // Checking review existence
  if(!review){
    throw new AppError(httpStatus.NOT_FOUND,'Review not found')
  }
  return await Review.findByIdAndUpdate(reviewId,payload,{runValidators:true,new:true})
  
  }
  

export const ReviewService = {
  createReviewIntoDB,
  deleteReviewFromDB,
  getBookReviewsFromDB,
  updateReviewIntoDB
};
