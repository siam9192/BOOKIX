import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidations } from './order.validation';
import { OrderController } from './order.controller';
import { AllRole } from '../../utils/constant';

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
  '/current-user/customer/yet-to-review',
  auth(TRole.CUSTOMER),
  OrderController.getCustomerYetToReviewOrders,
);

router.get('/current-user',auth(TRole.CUSTOMER),OrderController.getCurrentUserOrders)
router.get('/order-details/:orderId',auth(...Object.values(TRole)),OrderController.getOrderDetails)

router.patch(
  '/update-status',
  auth(TRole.ADMIN, TRole.MODERATOR),
  OrderController.updateOrderStatus,
);

router.patch('/cancel/:orderId',auth(...AllRole),OrderController.cancelOrder)
export const OrderRouter = router;
