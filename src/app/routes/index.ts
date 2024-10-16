import { IRouter, Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.route';
import { BookRouter } from '../modules/book/book.route';
import { CartRouter } from '../modules/cart/cart.route';
import { AuthorRouter } from '../modules/author/author.route';
import { WishBookRouter } from '../modules/wishBook/wishBook.route';
import { CouponRouter } from '../modules/coupon/coupon.route';
import { OrderRouter } from '../modules/order/order.route';
import { UserRouter } from '../modules/user/user.route';
import { NotificationRouter } from '../modules/notification/notification.route';
import { ReviewRouter } from '../modules/review/review.route';
import { PaymentRouter } from '../modules/payment/payment.route';
import { CategoryRouter } from '../modules/category/category.route';
import { OverviewRouter } from '../modules/overview/overview.route';

const router = Router();

type TModuleRoutes = { path: string; router: IRouter }[];

const moduleRoutes: TModuleRoutes = [
  {
    path: '/auth',
    router: AuthRouter,
  },
  {
    path: '/users',
    router: UserRouter,
  },
  {
    path: '/books',
    router: BookRouter,
  },
  {
    path: '/categories',
    router: CategoryRouter,
  },
  {
    path: '/authors',
    router: AuthorRouter,
  },
  {
    path: '/carts',
    router: CartRouter,
  },
  {
    path: '/wish-books',
    router: WishBookRouter,
  },
  {
    path: '/coupons',
    router: CouponRouter,
  },
  {
    path: '/orders',
    router: OrderRouter,
  },
  {
    path: '/reviews',
    router: ReviewRouter,
  },
  {
    path: '/notifications',
    router: NotificationRouter,
  },
  {
    path: '/payments',
    router: PaymentRouter,
  },
  {
    path: '/overview',
    router: OverviewRouter,
  },
];
const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
