import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';
import { PaymentController } from './payment.controller.';

const router = Router();

router.get('/', auth(TRole.ADMIN), PaymentController.getPayments);

export const PaymentRouter = router;
