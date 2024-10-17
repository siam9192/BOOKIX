import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';
import { PaymentController } from './payment.controller.';

const router = Router();

router.get('/', auth(TRole.ADMIN), PaymentController.getPayments);
router.get(
  '/current-user',
  auth(TRole.CUSTOMER),
  PaymentController.getCurrentUserPaymentHistory,
);
router.get(
  '/user/:userId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  PaymentController.getUserPaymentHistory,
);

export const PaymentRouter = router;
