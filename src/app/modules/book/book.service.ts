import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TBook } from './book.interface';
import { Book } from './book.model';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { Types } from 'mongoose';
import { objectId } from '../../utils/func';
import { number } from 'zod';

const createBookIntoDB = async (payload: TBook) => {
  // Creating book into db
  return await Book.create(payload);
};

const createMultipleBooksIntoDB = async (payload: TBook[]) => {
  return await Book.insertMany(payload);
};

const getBooksFromDB = async (query: any) => {
  if (query.categories) {
    query.category = { $in: (query.categories as string).split(',') };
    delete query.categories;
  }

  const sort = query.sort;
  let yetToSort;
  if (sort) {
    switch (sort) {
      case 'price(l-h)':
        yetToSort = sort;
        delete query.sort;
        break;
      case 'price(h-l)':
        yetToSort = sort;
        delete query.sort;
        break;
      case 'rating(l-h)':
        query.sort = 'rating';
        break;
      case 'rating(h-l)':
        query.sort = '-rating';
        break;
      default:
        break;
    }
  }
  // Get books which are not paused and not deleted
  query.is_paused = false;
  query.is_deleted = false;

  // Filtering books
  let result: any = await new QueryBuilder(Book.find(), query)
    .textSearch()
    .find()
    .sort()
    .paginate()
    .project('name', 'price', 'cover_images', 'rating')
    .get();
  const meta = await new QueryBuilder(Book.find(), query)
    .textSearch()
    .find()
    .project('name', 'price', 'cover_images', 'rating')
    .getMeta();

  if (yetToSort) {
    const modifiedResult: any[] = result
      .map((item: any) => {
        const modifiedItem = { ...item._doc };
        if (item.price.enable_discount_price) {
          modifiedItem.currentPrice = item.price.discount_price;
        } else {
          modifiedItem.currentPrice = item.price.main_price;
        }

        return modifiedItem;
      })
      .sort((a: any, b: any) => {
        if (yetToSort === 'price(l-h)') {
          return a.currentPrice - b.currentPrice;
        } else {
          return b.currentPrice - a.currentPrice;
        }
      });
    result = modifiedResult;
  }
  return {
    result,
    meta,
  };
};

const getBookFromDB = async (bookId: string) => {
  return await Book.findById(bookId).populate('author_bio');
};

const getFeaturedBooksFromDB = async () => {
  // Get books which are not paused and not deleted
  const query = {
    is_paused: false,
    is_deleted: false,
  };
  return await Book.find(query).sort({ rating: -1 }).limit(12);
};

const getSuggestedBooksFromDB = async () => {
  // Get books which are not paused and not deleted
  const query = {
    is_paused: false,
    is_deleted: false,
  };
  return await Book.find().sort({ sold: -1 }).limit(12);
};
const getRecentlyViewedBooks = async (bookIds: string[]) => {
  const objectIds = bookIds.map((id) => new Types.ObjectId(id));
  return await Book.find({ _id: { $in: objectIds } });
};

const getRelatedBooksFromDB = async (bookId: string) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }
  const result = await Book.find({
    _id: { $not: { $eq: objectId(bookId) } },
    category: book.category,
  }).limit(6);
  return result;
};

const deleteBookFromDB = async (bookId: string) => {
  const book = await Book.findById(bookId);
  // Checking book existence and is the book already deleted
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  } else if (book.is_deleted) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Book is already deleted');
  }

  return Book.findByIdAndUpdate(bookId, { is_deleted: true }, { new: true });
};

const updateBookIntoDB = async (bookId: string, payload: Partial<TBook>) => {
  const book = await Book.findById(bookId);
  // Checking book existence
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  }

  return await Book.findByIdAndUpdate(bookId, payload);
};

const pauseBookIntoDB = async (bookId: string) => {
  const book = await Book.findById(bookId);
  // Checking book existence and is the book already paused
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  } else if (book.is_paused) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Book is already paused');
  }
  const result = await Book.findByIdAndUpdate(
    bookId,
    { is_paused: true },
    { new: true },
  );
  return result;
};

const unpauseBookIntoDB = async (bookId: string) => {
  const book = await Book.findById(bookId);
  // Checking book existence and is the book already paused
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found');
  } else if (!book.is_paused) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Book is already unpaused');
  }
  const result = await Book.findByIdAndUpdate(
    bookId,
    { is_paused: false },
    { new: true },
  );
  return result;
};

const getBooksBasedOnDiscountFromDB = async (discount: string) => {
  const discountNumber = Number(discount);

  if (!discountNumber) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Something went wrong');
  }
  const result = await Book.aggregate([
    {
      $match: {
        'price.enable_discount_price': true,
        is_paused: false,
        is_deleted: false,
      },
    },
    {
      $addFields: {
        discount_percentage: {
          $multiply: [
            {
              $divide: [
                {
                  $subtract: ['$price.main_price', '$price.discount_price'],
                },
                '$price.main_price',
              ],
            },
            100,
          ],
        },
      },
    },
    {
      $match: {
        discount_percentage: { $lte: discountNumber },
      },
    },
    {
      $project: {
        name: 1,
        price: 1,
        cover_images: 1,
        rating: 1,
        discount_percentage: 1,
      },
    },
  ]);

  return result;
};

const getAuthorBooksFromDB = async (authorId: string) => {
  return await Book.find({ author_bio: objectId(authorId) }).select([
    'name',
    'price',
    'cover_images',
    'rating',
  ]);
};

export const BookService = {
  createBookIntoDB,
  createMultipleBooksIntoDB,
  getBooksFromDB,
  getBookFromDB,
  getFeaturedBooksFromDB,
  getSuggestedBooksFromDB,
  getRecentlyViewedBooks,
  getBooksBasedOnDiscountFromDB,
  getRelatedBooksFromDB,
  deleteBookFromDB,
  updateBookIntoDB,
  pauseBookIntoDB,
  unpauseBookIntoDB,
};
