import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendSuccessResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { AuthorService } from './author.service';

const createAuthor = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthorService.createAuthorIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Author created successfully',
    data: result,
  });
});

const getAuthor = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.params.authorId;
  const result = await AuthorService.getAuthorFromDB(authorId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Author retrieved successfully',
    data: result,
  });
});

const getAuthors = catchAsync(async (req: Request, res: Response) => {
  const name = req.query.name;
  const result = await AuthorService.getAuthorsFromDB(name as string);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Authors retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getPopularAuthors = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthorService.getPopularAuthorsFromDB(req.query);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Authors retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const updateAuthor = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.params.authorId;
  const result = await AuthorService.updateAuthorIntoDB(authorId, req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Author updated successfully',
    data: result,
  });
});

const deleteAuthor = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.params.authorId;
  const result = await AuthorService.deleteAuthorFromDB(authorId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Author deleted successfully',
    data: result,
  });
});

export const AuthorController = {
  createAuthor,
  getAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
  getPopularAuthors,
};
