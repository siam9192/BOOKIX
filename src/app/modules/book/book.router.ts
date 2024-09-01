import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookValidations } from "./book.validations";
import { BookController } from "./book.controller";

const router = Router()

router.post('/',validateRequest(BookValidations.createBookValidation),BookController.createBook)
router.post('/multiple',BookController.createMultipleBooks)
router.get('/',BookController.getBooks)
router.get('/featured',BookController.getFeaturedBooks)
router.get('/suggested',BookController.getSuggestBooks)
router.get('/recently-viewed',BookController.getRecentlyViewedBooks)
router.post('/pause-book/:bookId',BookController.pauseBook)
router.post('/unpause-book/:bookId',BookController.unpauseBook)
router.delete('/:bookId',BookController.deleteBook)



export const BookRouter = router