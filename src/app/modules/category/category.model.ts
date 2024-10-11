import { model, Schema } from 'mongoose';

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  is_hidden: {
    type: Boolean,
    default: false,
  },
});

export const Category = model<ICategory>('Category', CategorySchema);
