import { Router } from "express";
import auth from "../../middlewares/auth";
import { TRole } from "../user/user.interface";
import validateRequest from "../../middlewares/validateRequest";
import { AuthorValidations } from "./author.validation";
import { AuthorController } from "./author.controller";

const router = Router()

router.post('/',auth(TRole.ADMIN,TRole.CUSTOMER),validateRequest(AuthorValidations.createAuthorValidation),AuthorController.createAuthor)

router.get('/',AuthorController.getAuthors)
router.get('/:authorId',AuthorController.getAuthor)

router.patch('/:authorId',validateRequest(AuthorValidations.updateAuthorValidation),AuthorController.updateAuthor)

router.delete('/:authorId',AuthorController.deleteAuthor)

export const AuthorRouter = router