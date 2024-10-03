import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { Category } from './category.model';
import { objectId } from '../../utils/func';


const createCategoryIntoDB = async (payload: ICategory) => {
  const category = await Category.exists({ name: payload.name });

  // Checking is the category already exists with the same name
  if (category) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Category already exists');
  }
  return await Category.create(payload);
};

const getCategoriesFromDB = async () => {
  return await Category.find({ is_hidden: false });
};

const deleteCategoryFromDB = async (categoryId: string) => {
  const deleteStatus = await Category.deleteOne({ _id: objectId(categoryId) });
  if (!deleteStatus.deletedCount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Category can not be deleted. something went wrong',
    );
  }

  return null;
};

export const CategoryService = {
  createCategoryIntoDB,
  getCategoriesFromDB,
  deleteCategoryFromDB,
};
