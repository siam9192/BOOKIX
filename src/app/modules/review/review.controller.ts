import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await ReviewService.createReviewIntoDB(userId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review created successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = ReviewService.deleteReviewFromDB(id);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review deleted successfully',
    data: result,
  });
});

const getBookReviews = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const result = await ReviewService.getBookReviewsFromDB(bookId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = req.params.reviewId;
  const result = await ReviewService.updateReviewIntoDB(reviewId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review updated successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  deleteReview,
  getBookReviews,
  updateReview,
};
