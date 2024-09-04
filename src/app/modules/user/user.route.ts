import { Router } from 'express';
import auth from '../../middlewares/auth';
import { TRole } from './user.interface';
import { UserController } from './user.controller';

const router = Router();

router.get('/', auth(TRole.ADMIN, TRole.MODERATOR), UserController.getUsers);
router.get(
  '/:userId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  UserController.getUser,
);

// router.patch('//block')
router.patch('/change-role', auth(TRole.ADMIN));
