import { Router } from 'express';
import { cartController } from './cart.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CartValidation } from './cart.validation';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';

const router = Router();

router.get(
  '/',
  auth(TRole.CUSTOMER, TRole.MODERATOR, TRole.MODERATOR),
  cartController.getCartItems,
);
router.post(
  '/',
  auth(TRole.CUSTOMER, TRole.MODERATOR, TRole.MODERATOR),
  validateRequest(CartValidation.createCartItemValidation),
  cartController.createCart,
);
router.patch(
  '/',
  auth(TRole.CUSTOMER, TRole.MODERATOR, TRole.MODERATOR),
  validateRequest(CartValidation.updateCartItemQuantityValidation),
  cartController.updateCartItemQuantity,
);
router.delete(
  '/:itemId',
  auth(TRole.CUSTOMER, TRole.MODERATOR, TRole.MODERATOR),
  cartController.deleteCartItem,
);

export const CartRouter = router;
