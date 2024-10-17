import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import QueryBuilder from '../../middlewares/QueryBuilder';
import { TAuthor } from './author.interface';
import { Author } from './author.model';
import { Book } from '../book/book.model';
import { objectId } from '../../utils/func';

const createAuthorIntoDB = async (payload: TAuthor) => {
  return await Author.create(payload);
};

const getAuthorFromDB = async (authorId: string) => {
  return Author.findById(authorId);
};

const getAuthorsFromDB = async (name: string) => {
  const query = {
    searchTerm: name,
  };
  const data = await new QueryBuilder(Author.find(), query)
    .textSearch()
    .paginate()
    .get();
  const meta = await new QueryBuilder(Author.find(), query)
    .textSearch()
    .getMeta();
  return {
    data,
    meta,
  };
};

const updateAuthorIntoDB = async (
  authorId: string,
  payload: Partial<TAuthor>,
) => {
  const author = await Author.findById(authorId);

  // Checking author existence
  if (!author) {
    throw new AppError(httpStatus.NOT_FOUND, 'Author not found');
  }
  //   Updating author details
  return await Author.findByIdAndUpdate(authorId, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteAuthorFromDB = async (authorId: string) => {
  const author = await Author.findById(authorId);

  // Checking author existence
  if (!author) {
    throw new AppError(httpStatus.NOT_FOUND, 'Author not found');
  }
  return await Author.findByIdAndDelete(authorId, { new: true });
};

const getPopularAuthorsFromDB = async (query: any) => {
  const data = await new QueryBuilder(Author.find(), query)
    .find()
    .sort()
    .paginate()
    .get();
  const meta = await new QueryBuilder(Author.find(), query).find().getMeta();
  return {
    data,
    meta,
  };
};

const getAuthorBooksFromDB = async (authorId: string) => {
  return await Book.find({ author_bio: objectId(authorId) }).select([
    'name',
    'price',
    'cover_images',
    'rating',
  ]);
};

export const AuthorService = {
  createAuthorIntoDB,
  getAuthorFromDB,
  getAuthorsFromDB,
  getPopularAuthorsFromDB,
  updateAuthorIntoDB,
  deleteAuthorFromDB,
};
