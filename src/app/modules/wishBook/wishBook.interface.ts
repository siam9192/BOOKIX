import { Types } from 'mongoose';

export type TWishBook = {
  book: Types.ObjectId;
  user: Types.ObjectId;
};
