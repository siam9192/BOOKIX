import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse } from '../../utils/response';
import catchAsync from '../../utils/catchAsync';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategoryIntoDB(req.body);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  });
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategoriesFromDB();
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const result = await CategoryService.deleteCategoryFromDB(categoryId);
  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  deleteCategory,
};
