import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BookService } from './book.service';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.createBookIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Book created successfully',
    data: result,
  });
});
const createMultipleBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.createMultipleBooksIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Books created successfully',
    data: result,
  });
});

const getBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getBooksFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Books retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getBooksForDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getBooksForDashboardFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Books retrieved successfully',
    data: result.result,
    meta: result.meta,
  });
});

const getBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const result = await BookService.getBookFromDB(bookId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const getFeaturedBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getFeaturedBooksFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Featured Books retrieved successfully',
    data: result,
  });
});
const getSuggestBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getSuggestedBooksFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Suggested Books retrieved successfully',
    data: result,
  });
});

const getRecentlyViewedBooks = catchAsync(
  async (req: Request, res: Response) => {
    const bookIds = req.body.book_ids;
    const result = await BookService.getRecentlyViewedBooks(bookIds);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Recently viewed Books retrieved successfully',
      data: result,
    });
  },
);

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const result = await BookService.updateBookIntoDB(bookId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book updated successfully',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const result = await BookService.deleteBookFromDB(bookId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book deleted successfully',
    data: result,
  });
});

const deleteMultipleBooksFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.deleteMultipleBooksFromDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Books deleted successfully',
    data: result,
  });
});

const pauseBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const result = await BookService.pauseBookIntoDB(bookId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book Paused successfully',
    data: result,
  });
});

const unpauseBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const result = await BookService.unpauseBookIntoDB(bookId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book unpaused successfully',
    data: result,
  });
});

const getBooksBasedOnDiscount = catchAsync(
  async (req: Request, res: Response) => {
    const discount = req.params.percentage;
    const result = await BookService.getBooksBasedOnDiscountFromDB(
      discount,
      req.query,
    );
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Books retrieved  successfully based on discount',
      data: result,
    });
  },
);

const getRelatedBooks = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const result = await BookService.getRelatedBooksFromDB(bookId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Related Books retrieved successfully',
    data: result,
  });
});

const getFreeDeliveryBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getFreeDeliveryBooksFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Free delivery Books retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const BookController = {
  createBook,
  createMultipleBooks,
  getBooks,
  getBooksForDashboard,
  getBook,
  getFeaturedBooks,
  getSuggestBooks,
  getRecentlyViewedBooks,
  getBooksBasedOnDiscount,
  getFreeDeliveryBooks,
  getRelatedBooks,
  updateBook,
  deleteBook,
  deleteMultipleBooksFromDB,
  pauseBook,
  unpauseBook,
};
