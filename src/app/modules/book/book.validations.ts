import { z } from 'zod';

// Price Schema
const PriceSchema = z.object({
  main_price: z.number().min(0),
  discount_price: z.number().min(0),
  enable_discount_price: z.boolean(),
});

// Dimension Schema
const DimensionSchema = z.object({
  height: z.number().min(0),
  width: z.number().min(0),
  thickness: z.number().min(0),
});

// Author Bio Schema
const AuthorBioSchema = z.object({
  name: z.string().min(1),
  biography: z.string().min(1),
  birth_date: z.string().min(1), // You may want to use z.string().regex(/^\d{4}-\d{2}-\d{2}$/) for date validation
  nationality: z.string().min(1),
});

// Publisher Schema
const PublisherSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  website: z.string().url().optional(), // Optional and must be a valid URL if provided
});

// Additional Info Schema
const AdditionalInfoSchema = z.object({
  awards: z.array(z.string()).optional(),
  series: z.string().nullable().optional(),
  volume: z.number().nullable().optional(),
  first_edition_year: z.number().nullable().optional(),
  illustrations: z.boolean().nullable().optional(),
  synopsis: z.string().nullable().optional(),
});

// Book Schema
const createBookValidation = z.object({
  name: z.string().min(1),
  price: PriceSchema,
  description: z.string().min(20),
  author: z.string().min(1),
  author_bio: z.string().nullable().optional(),
  category: z.string().min(1),
  language: z.string().min(1),
  print_length: z.number().min(1),
  published_date: z.string().min(1),
  edition: z.string().min(1),
  isbn: z.string().min(1),
  format: z.string().min(1),
  dimension: DimensionSchema,
  tags: z.array(z.string()).optional(),
  cover_images: z.array(z.string()).optional(),
  publisher: PublisherSchema,
  additional_info: AdditionalInfoSchema.optional(),
  available_stock: z.number(),
});

const updateBookValidation = createBookValidation.partial();

export const BookValidations = {
  createBookValidation,
  updateBookValidation,
};
