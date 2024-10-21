import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookValidations } from './book.validations';
import { BookController } from './book.controller';
import auth from '../../middlewares/auth';
import { TRole } from '../user/user.interface';

const router = Router();

router.get('/', BookController.getBooks);
router.get('/featured', BookController.getFeaturedBooks);
router.get('/suggested', BookController.getSuggestBooks);
router.post(
  '/recently-viewed',
  validateRequest(BookValidations.getRecentlyViewedBooksValidations),
  BookController.getRecentlyViewedBooks,
);
router.get('/discount/:percentage', BookController.getBooksBasedOnDiscount);
router.get('/related-books/:bookId', BookController.getRelatedBooks);
router.get('/free-delivery', BookController.getFreeDeliveryBooks);

//-------(Warning)   Maintain the position--------//
router.get('/dashboard', BookController.getBooksForDashboard); //1//
router.get('/:bookId', BookController.getBook); //2//
//--------//

router.post(
  '/',
  auth(TRole.ADMIN, TRole.MODERATOR),
  validateRequest(BookValidations.createBookValidation),
  BookController.createBook,
);
router.post(
  '/multiple',
  auth(TRole.ADMIN, TRole.MODERATOR),
  BookController.createMultipleBooks,
);
router.post(
  '/pause-book/:bookId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  BookController.pauseBook,
);
router.post(
  '/unpause-book/:bookId',
  auth(TRole.ADMIN, TRole.MODERATOR),
  BookController.unpauseBook,
);

router.put(
  '/:bookId',
  // auth(TRole.ADMIN, TRole.MODERATOR),
  validateRequest(BookValidations.updateBookValidation),
  BookController.updateBook,
);

//-------(Warning)   Maintain the position------------------------------------------//
router.post('/delete-multiple',validateRequest(BookValidations.deleteMultipleBooksValidation),BookController.deleteMultipleBooksFromDB);
router.delete('/:bookId', BookController.deleteBook);
//-----------------------------------------------------------------------------------//
export const BookRouter = router;
