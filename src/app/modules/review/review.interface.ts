import { Model, Types } from 'mongoose';

export type TReview = {
  comment: string;
  images?: string[];
  rating: number;
  is_hidden?: boolean;
  book: Types.ObjectId;
  order:Types.ObjectId
  customer: Types.ObjectId;
};

export interface TReviewMethods extends Model<TReview> {
  isReviewExists: (id: string) => Promise<TReview>;
}
