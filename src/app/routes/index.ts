import { IRouter, Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";
import { BookRouter } from "../modules/book/book.router";
import { CartRouter } from "../modules/cart/cart.route";
import { AuthorRouter } from "../modules/author/author.route";

const router = Router();

type TModuleRoutes = { path: string; router: IRouter }[];

const moduleRoutes: TModuleRoutes = [
 {
  path:'/auth',
  router:AuthRouter
 },
 {
  path:'/books',
  router:BookRouter
 },
 {
  path:'/authors',
  router:AuthorRouter
 },
 {
  path:'/carts',
  router:CartRouter
 }
];
const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
