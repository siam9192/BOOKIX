import { Types } from 'mongoose';

export type TCart = {
  book: Types.ObjectId;
  quantity: number;
  user: Types.ObjectId;
};
