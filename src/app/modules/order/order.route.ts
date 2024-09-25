import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import { OrderController } from './order.controller';

const router = Router();

router.post(
  '/',
  auth(TRole.CUSTOMER),
  validateRequest(OrderValidations.createOrderValidation),
  OrderController.createOrder,
);

router.get('/payment-success', OrderController.managePaymentSuccessOrders);
router.get(
  '/payment/paypal/success',
  OrderController.managePaypalPaymentSuccessOrders,
);
router.get('/payment/cancel', OrderController.managePaymentCanceledOrder);

router.get('/', auth(TRole.ADMIN, TRole.MODERATOR), OrderController.getOrders);
router.get(
  '/customer/yet-to-review',
  auth(TRole.CUSTOMER),
  OrderController.getCustomerYetToReviewOrders,
);

router.patch(
  '/update-status',
  auth(TRole.ADMIN, TRole.MODERATOR),
  OrderController.updateOrderStatus,
);
export const OrderRouter = router;
