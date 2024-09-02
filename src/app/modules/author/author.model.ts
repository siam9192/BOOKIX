import { model, Schema } from 'mongoose';
import { TAuthor } from './author.interface';

const authorSchema = new Schema<TAuthor>({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    minlength: 20,
    required: true,
  },
  birth_date: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
});

authorSchema.index({ name: 'text' });
export const Author = model<TAuthor>('Author', authorSchema);
