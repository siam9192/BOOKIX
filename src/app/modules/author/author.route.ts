import { Router } from "express";
import auth from "../../middlewares/auth";
import { TRole } from "../user/user.interface";
import validateRequest from "../../middlewares/validateRequest";
import { AuthorValidations } from "./author.validation";
import { AuthorController } from "./author.controller";

const router = Router()

router.post('/',auth(TRole.ADMIN,TRole.MODERATOR),validateRequest(AuthorValidations.createAuthorValidation),AuthorController.createAuthor)

router.get('/',AuthorController.getAuthors)
router.get('/:authorId',AuthorController.getAuthor)

router.patch('/:authorId',auth(TRole.ADMIN,TRole.MODERATOR),validateRequest(AuthorValidations.updateAuthorValidation),AuthorController.updateAuthor)

router.delete('/:authorId',auth(TRole.ADMIN,TRole.MODERATOR),AuthorController.deleteAuthor)

export const AuthorRouter = router