import { model, Schema } from 'mongoose';
import { TReview, TReviewMethods } from './review.interface';

const reviewSchema = new Schema<TReview>({
  images: {
    type: [String],
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  is_hidden: {
    type: Boolean,
    default: false,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

reviewSchema.statics.isReviewExists = async (id) => {
  return await Review.findById(id);
};

export const Review = model<TReview, TReviewMethods>('Review', reviewSchema);
