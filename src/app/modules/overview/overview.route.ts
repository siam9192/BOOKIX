import { Router } from 'express';
import { TRole } from '../user/user.interface';
import { OverviewController } from './overview.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get(
  '/customer',
  auth(TRole.CUSTOMER),
  OverviewController.getCustomerAccountOverView,
);

router.get('/admin',OverviewController.getAdminOverviewData)
router.get('/admin/analysis', OverviewController.getAdminOverviewAnalysis);
router.get('/admin/milestones',OverviewController.getAdminOverviewMilestones)
export const OverviewRouter = router;
