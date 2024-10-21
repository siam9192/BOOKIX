import { model, Schema } from 'mongoose';
import {
  TAdditionalInfo,
  TAuthorBio,
  TBook,
  TDimension,
  TPrice,
  TPublisher,
} from './book.interface';

const PriceSchema = new Schema<TPrice>({
  main_price: { type: Number, required: true },
  discount_price: { type: Number, required: true },
  enable_discount_price: { type: Boolean, required: true },
});

const DimensionSchema = new Schema<TDimension>({
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  thickness: { type: Number, required: true },
});

const AuthorBioSchema = new Schema<TAuthorBio>({
  name: { type: String, required: true },
  biography: { type: String, required: true },
  birth_date: { type: String, required: true },
  nationality: { type: String, required: true },
});

const PublisherSchema = new Schema<TPublisher>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, default: null },
});

const AdditionalInfoSchema = new Schema<TAdditionalInfo>({
  awards: [{ type: String, default: null }],
  series: { type: String, default: null },
  volume: { type: Number, default: null },
  first_edition_year: { type: Number, default: null },
  illustrations: { type: Boolean, default: null },
  synopsis: { type: String, default: null },
});

const BookSchema = new Schema<TBook>(
  {
    name: { type: String, required: true },
    price: { type: PriceSchema, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    author_bio: { type: Schema.Types.ObjectId, ref: 'Author', default: null },
    category: { type: String, required: true },
    _language: { type: String, required: true },
    print_length: { type: Number, required: true },
    published_date: { type: String, required: true },
    edition: { type: String, required: true },
    isbn: { type: String, required: true },
    format: { type: String, required: true },
    dimension: { type: DimensionSchema, required: true },
    tags: [{ type: String }],
    cover_images: [{ type: String }],
    publisher: { type: PublisherSchema, required: true },
    additional_info: { type: AdditionalInfoSchema, default: null },
    available_stock: { type: Number, min: 0, required: true },
    free_delivery: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    is_paused: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

BookSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  author: 'text',
});

export const Book = model<TBook>('Book', BookSchema);
