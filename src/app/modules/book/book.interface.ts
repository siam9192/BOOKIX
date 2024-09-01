import { Types } from "mongoose";

export type TPrice = {
  main_price: number;
  discount_price: number;
  enable_discount_price: boolean;
};
export type TDimension = {
  height: number; // Height of the book (in inches)
  width: number; // Width of the book (in inches)
  thickness: number; // Thickness of the book (in inches)
};

export type TAuthorBio = {
  name: string; // Full name of the author
  photo: string; //Photo of the author
  biography: string; // Short biography of the author
  birth_date: string; // Birth date of the author
  nationality: string; // Nationality of the author
};

export type TPublisher = {
  name: string; // Name of the publisher
  address: string; // Publisher's address
  website?: string; // Publisher's website URL
};

export type TAdditionalInfo = {
  awards?: string[]; // List of awards the book has won
  series?: string; // Name of the series if the book is part of one
  volume?: number; // Volume number if the book is part of a series
  first_edition_year?: number; // Year of the first edition if applicable
  illustrations?: boolean; // Indicates if the book contains illustrations
  synopsis?: string; // Brief synopsis or plot summary
};

export type TBook = {
  name: string; // Title of the book
  price: TPrice; // Price of the book
  description: string; // Description or summary of the book
  author: string; // Name of the author
  author_bio?:Types.ObjectId; // Detailed biography of the author
  category: string; // Genre or category of the book
  language: string; // Language in which the book is written
  print_length: number; // Length of the book in pages
  published_date: string; // Publication date of the book
  edition: string; // Edition of the book
  isbn: string; // International Standard Book Number
  format: string; // Format of the book (e.g., Hardcover, Paperback)
  dimension: TDimension; // Dimensions of the book
  tags: string[]; // Tags or keywords related to the book
  cover_images: string[]; // Array of cover image URLs
  publisher: TPublisher; // Publisher information
  additional_info?: TAdditionalInfo; // Additional information about the book
  rating: number; // Average rating (e.g., out of 5)
  sold: number; // Number of copies sold
  reviews: number; // Number of reviews
  is_paused: boolean; // Indicates if the book's sales are paused
  is_deleted: boolean; // Indicates if the book has been deleted from the catalog
};
