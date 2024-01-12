"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("../controllers/books.controller");
const router = express_1.default.Router();
router.get('/', books_controller_1.getAllBooks);
router.get('/user/:userId', books_controller_1.getBooksForUser);
router.get('/:id', books_controller_1.getBookById);
router.post('/', books_controller_1.createBook);
router.put('/:id', books_controller_1.updateBook);
router.delete('/:id', books_controller_1.deleteBook);
exports.default = router;
