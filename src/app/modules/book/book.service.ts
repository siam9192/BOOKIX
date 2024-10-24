import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TBook } from './book.interface';
import { Book } from './book.model';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { startSession, Types } from 'mongoose';
import { objectId } from '../../utils/func';

const createBookIntoDB = async (payload: TBook) => {
  // Creating book into db
  return await Book.insertMany(payload);
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

  const minPrice = parseInt(query['min-price']);
  const maxPrice = parseInt(query['max-price']);

  if (minPrice) {
    query['price.main_price'] = {
      $gt: minPrice,
    };
  }
  if (maxPrice) {
    if (query['price.main_price']) {
      query['price.main_price'].$lt = maxPrice;
    } else {
      query['price.main_price'] = {
        $lt: maxPrice,
      };
    }
  }
  delete query['min-price'];
  delete query['max-price'];

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

const getBooksForDashboardFromDB = async (query: any) => {
  const filter = query.filter;
  const sort = query.sortBy;
  const perPage = query.perPage;

  // Delete unnecessary properties from query other wise can not get data correctly
  delete query.sortBy;
  delete query.perPage;
  delete query.sort;

  let yetToSort;

  // If filter exists in query then find data based on filter value
  if (filter) {
    switch (filter) {
      case 'in-stock':
        query.stock = {
          $gt: 0,
        };
        break;
      case 'stock-out':
        query.stock = {
          $eq: 0,
        };
      case 'paused':
        query.paused = true;
      case 'active':
        query.paused = false;
      case 'stock-out':
        query.stock = {
          $eq: 0,
        };

        query.stock = {
          $eq: 0,
        };

      default:
        break;
    }

    // Delete the filter property from query object other wise  can not get data correctly
    delete query.filter;
  }

  // If sort property exists with the value then append the sort value in query object
  if (sort) {
    switch (sort) {
      case 'price(asc)':
        yetToSort = sort;
        break;
      case 'price(des)':
        yetToSort = sort;
        break;
      case 'sell(asc)':
        query.sort = 'sold';
        break;
      case 'sell(des)':
        query.sort = '-sold';
        break;
      case 'sell(asc)':
        query.sort = 'rating';
        break;
      case 'rating(des)':
        query.sort = '-rating';
        break;
      default:
    }
  }

  // If perPage property exists and it's value not string then append perPage as a limit in query object
  if (perPage && Number(perPage)) {
    query.limit = perPage;
  }
 
  // Get only not deleted books
  query.is_deleted = false
  
 
  // Get the books
  let result: any = await new QueryBuilder(Book.find(), query)
    .textSearch()
    .find()
    .sort()
    .paginate()
    .project(
      'name',
      'price',
      'cover_images',
      'rating',
      'is_paused',
      'sold',
      'available_stock',
    )
    .get();

  const meta = await new QueryBuilder(Book.find(), query)
    .textSearch()
    .find()
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
        // Sort price in ascending
        if (yetToSort === 'price(asc)') {
          return a.currentPrice - b.currentPrice;
        }
        // Sort price in descending
        else {
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

const getFreeDeliveryBooksFromDB = async (query: any) => {
  // query.free_delivery = true

  const data = await new QueryBuilder(Book.find(), query)
    .find()
    .paginate()
    .project('name', 'price', 'cover_images', 'rating')
    .get();
  const meta = await new QueryBuilder(Book.find(), query)
    .find()
    .paginate()
    .getMeta();
  return {
    data,
    meta,
  };
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

const deleteMultipleBooksFromDB = async(payload:{booksId:string[]})=>{

  
  const session = await startSession()
  await session.startTransaction()
  

  try {
    const booksId = payload.booksId.map(id=>objectId(id))
    const deleteStatus = await Book.updateMany({_id:{$in:booksId}},{is_deleted:true},{session})
    
    
    if((!deleteStatus.modifiedCount)||(deleteStatus.modifiedCount !== booksId.length)){
        throw new Error('Books can not be deleted')
    }
   await session.commitTransaction()
   await session.endSession()
  } catch (error:any) {
   
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(400,error?.message||'Something went wrong')
  
  }
  
}

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

const getBooksBasedOnDiscountFromDB = async (discount: string, query: any) => {
  const discountNumber = Number(discount);

  if (!discountNumber) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Something went wrong');
  }
  const limit = query.limit || 6;

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
      $limit: Number(limit),
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
  deleteMultipleBooksFromDB,
  updateBookIntoDB,
  pauseBookIntoDB,
  unpauseBookIntoDB,
  getFreeDeliveryBooksFromDB,
  getBooksForDashboardFromDB,
};
