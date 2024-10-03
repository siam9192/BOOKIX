import { z } from 'zod';

const createReviewValidation = z.object({
  order:z.string(),
  book: z.string(),
  images: z.array(z.string()).optional(),
  comment: z.string(),
  rating: z.number().max(5),
});

const reviewUpdateValidation = createReviewValidation.partial();
export const reviewValidations = {
  createReviewValidation,
  reviewUpdateValidation,
};
