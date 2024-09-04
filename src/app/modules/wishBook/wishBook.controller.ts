import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { WishBookService } from './wishBook.service';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';

const createWiseBook = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const bookId = req.body.bookId;
  const result = await WishBookService.createWiseBookIntoDB(userId, bookId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Wish book created successfully on wishlist',
    data: result,
  });
});

const getWishBooks = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await WishBookService.getWishBooksFromDB(userId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Wish book create on wishlist',
    data: result,
  });
});

const deleteWiseBook = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const wishBookId = req.body.wishBookId;
  const result = await WishBookService.deleteWiseBookFromDB(userId, wishBookId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Wish book create on wishlist',
    data: result,
  });
});

export const WishBookController = {
  createWiseBook,
  getWishBooks,
  deleteWiseBook,
};
