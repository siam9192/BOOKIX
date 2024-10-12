"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidations = void 0;
const zod_1 = require("zod");
// Price Schema
const PriceSchema = zod_1.z.object({
    main_price: zod_1.z.number().min(0),
    discount_price: zod_1.z.number().min(0),
    enable_discount_price: zod_1.z.boolean(),
});
// Dimension Schema
const DimensionSchema = zod_1.z.object({
    height: zod_1.z.number().min(0),
    width: zod_1.z.number().min(0),
    thickness: zod_1.z.number().min(0),
});
// Author Bio Schema
const AuthorBioSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    biography: zod_1.z.string().min(1),
    birth_date: zod_1.z.string().min(1), // You may want to use z.string().regex(/^\d{4}-\d{2}-\d{2}$/) for date validation
    nationality: zod_1.z.string().min(1),
});
// Publisher Schema
const PublisherSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    website: zod_1.z.string().url().optional(), // Optional and must be a valid URL if provided
});
// Additional Info Schema
const AdditionalInfoSchema = zod_1.z.object({
    awards: zod_1.z.array(zod_1.z.string()).optional(),
    series: zod_1.z.string().nullable().optional(),
    volume: zod_1.z.number().nullable().optional(),
    first_edition_year: zod_1.z.number().nullable().optional(),
    illustrations: zod_1.z.boolean().nullable().optional(),
    synopsis: zod_1.z.string().nullable().optional(),
});
// Book Schema
const createBookValidation = zod_1.z.object({
    name: zod_1.z.string().min(1),
    price: PriceSchema,
    description: zod_1.z.string().min(20),
    author: zod_1.z.string().min(1),
    author_bio: zod_1.z.string().nullable().optional(),
    category: zod_1.z.string().min(1),
    language: zod_1.z.string().min(1),
    print_length: zod_1.z.number().min(1),
    published_date: zod_1.z.string().min(1),
    edition: zod_1.z.string().min(1),
    isbn: zod_1.z.string().min(1),
    format: zod_1.z.string().min(1),
    dimension: DimensionSchema,
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    cover_images: zod_1.z.array(zod_1.z.string()).optional(),
    publisher: PublisherSchema,
    additional_info: AdditionalInfoSchema.optional(),
    available_stock: zod_1.z.number(),
});
const updateBookValidation = createBookValidation.partial();
exports.BookValidations = {
    createBookValidation,
    updateBookValidation,
};
