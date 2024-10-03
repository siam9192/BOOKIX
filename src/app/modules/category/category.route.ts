import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { z } from 'zod';
import { CategoryController } from './category.controller';
import { TRole } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  auth(TRole.CUSTOMER,TRole.ADMIN,TRole.MODERATOR),
  validateRequest(z.object({ name: z.string(),image:z.string()})),
  CategoryController.createCategory,
);

router.get('/', CategoryController.getCategories);

router.delete(
  '/:categoryId',
  auth(TRole.ADMIN,TRole.MODERATOR),
  CategoryController.deleteCategory,
);

export const CategoryRouter = router;
