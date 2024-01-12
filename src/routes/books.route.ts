import express from 'express';
import {
  getAllBooks,
  getBooksForUser,
  createBook,
  updateBook,
  deleteBook,
  getBookById,
} from '../controllers/books.controller';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/user/:userId', getBooksForUser);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
