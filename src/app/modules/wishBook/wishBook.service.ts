import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { objectId } from '../../utils/func';
import { WishBook } from './wishBook.model';

const createWiseBookIntoDB = async (userId: string, bookId: string) => {
  const wishBook = await WishBook.findOne({
    user: objectId(userId),
    book: objectId(bookId),
  });

  // Checking is the book already exists on user wishlist
  if (wishBook) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'This book is already added on your wishlist',
    );
  }
  const data = {
    book: bookId,
    user: userId,
  };
  return await WishBook.create(data);
};

const getWishBooksFromDB = async (userId: string) => {
  return await WishBook.find({user: objectId(userId)}).populate('book');
};

const deleteWiseBookFromDB = async (userId: string, wishBookId: string) => {
  const wishBook = await WishBook.findOne({
    _id: objectId(wishBookId),
    user: objectId(userId),
  });

  // Checking book existence on wishlist
  if (!wishBook) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Book not not found in wishlist',
    );
  }

  return await WishBook.findByIdAndDelete(wishBookId, { new: true });
};


export const WishBookService = {
    createWiseBookIntoDB,
    getWishBooksFromDB,
    deleteWiseBookFromDB
}