import { Router } from "express";
import auth from "../../middlewares/auth";
import { TRole } from "../user/user.interface";
import validateRequest from "../../middlewares/validateRequest";
import { WiseBookValidations } from "./wishBook.validation";
import { WishBookController } from "./wishBook.controller";

const router = Router()

router.post('/',auth(TRole.CUSTOMER,TRole.MODERATOR,TRole.ADMIN),validateRequest(WiseBookValidations.createWiseBookValidation),WishBookController.createWiseBook)

router.get('/',auth(TRole.CUSTOMER,TRole.MODERATOR,TRole.ADMIN),WishBookController.getWishBooks)


router.delete('/:wishBookId',auth(TRole.CUSTOMER,TRole.MODERATOR,TRole.ADMIN),WishBookController.deleteWiseBook)

export const WishBookRouter = router