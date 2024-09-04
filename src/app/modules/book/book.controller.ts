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
    data: result,
  });
});

const getBook = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.id;
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
    const bookIds = req.body.bookIds;
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
    const result = await BookService.getBooksBasedOnDiscountFromDB(discount);
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Books retrieved  successfully based on discount',
      data: result,
    });
  },
);

const pay = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.pay();
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Books retrieved  successfully based on discount',
    data: result,
  });
});

export const BookController = {
  createBook,
  createMultipleBooks,
  getBooks,
  getBook,
  getFeaturedBooks,
  getSuggestBooks,
  getRecentlyViewedBooks,
  updateBook,
  deleteBook,
  pauseBook,
  unpauseBook,
  getBooksBasedOnDiscount,
  pay,
};
