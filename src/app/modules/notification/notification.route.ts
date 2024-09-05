import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';
import { NotificationController } from './notification.controller';
import validateRequest from '../../middlewares/validateRequest';
import { NotificationValidations } from './notification.validation';

const router = Router();

router.post(
  '/',
  auth(TRole.ADMIN, TRole.MODERATOR),
  validateRequest(NotificationValidations.createNotificationValidation),
  NotificationController.createNotification,
);

router.get(
  '/',
  auth(...Object.values(TRole)),
  NotificationController.getUserNotifications,
);

router.patch(
  '/make-as-read',
  auth(...Object.values(TRole)),
  NotificationController.makeAsReadNotifications,
);

export const NotificationRouter = router;
