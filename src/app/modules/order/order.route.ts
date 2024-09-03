import { Router } from "express";
import auth from "../../middlewares/auth";
import { TRole } from "../user/user.interface";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidations } from "./order.validation";
import { OrderController } from "./order.controller";

const router = Router()

router.post('/',auth(TRole.MODERATOR),validateRequest(OrderValidations.createOrderValidation),OrderController.createOrder)

router.get('/payment-success',OrderController.managePaymentSuccessOrders)


export const OrderRouter = router