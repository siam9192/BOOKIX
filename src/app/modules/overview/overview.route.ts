import { Router } from "express";
import { TRole } from "../user/user.interface";
import { OverviewController } from "./overview.controller";
import auth from "../../middlewares/auth";

const router = Router()

router.get('/customer',auth(TRole.CUSTOMER),OverviewController.getCustomerAccountOverView)




export const OverviewRouter =  router