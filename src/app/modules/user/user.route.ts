import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from './user.interface';
import { UserController } from './user.controller';
import { AllRole } from '../../utils/constant';

const router = Router();

router.get('/', auth(TRole.ADMIN, TRole.MODERATOR), UserController.getUsers);
router.get('/current-user', auth(...AllRole), UserController.getCurrentUser);
router.get(
  '/:userId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  UserController.getUser,
);

// router.patch('//block')
router.patch('/change-role', auth(TRole.ADMIN));

export const UserRouter = router;
