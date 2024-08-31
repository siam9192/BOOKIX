import { IRouter, Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route";

const router = Router();

type TModuleRoutes = { path: string; router: IRouter }[];

const moduleRoutes: TModuleRoutes = [
 {
  path:'/auth',
  router:AuthRouter
 }
];
const routes = moduleRoutes.map((route) =>
  router.use(route.path, route.router),
);

export default routes;
