import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { reviewValidations } from './review.validation';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  auth(TRole.CUSTOMER),
  validateRequest(reviewValidations.createReviewValidation),
  ReviewController.createReview,
);

router.get('/:bookId', ReviewController.getBookReviews);

router.delete(
  '/:reviewId',
  auth(TRole.CUSTOMER),
  ReviewController.deleteReview,
);

router.patch(
  '/:reviewId',
  auth(TRole.CUSTOMER),
  validateRequest(reviewValidations.reviewUpdateValidation),
  ReviewController.updateReview,
);

export const ReviewRouter = router;
