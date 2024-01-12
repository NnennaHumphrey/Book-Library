"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBooksForUser = exports.getBookById = exports.getAllBooks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const books_model_1 = require("../models/books.model");
const books_validation_1 = require("../schema/books.validation");
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield books_model_1.Book.find();
        if (!books || books.length === 0) {
            return res.status(404).json({ message: 'No books found.' });
        }
        res.status(200).json({ books });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield books_model_1.Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        res.status(200).json({ book });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getBookById = getBookById;
const getBooksForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const userBooks = yield books_model_1.Book.find({ userId });
        res.status(200).json({ userBooks });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getBooksForUser = getBooksForUser;
// ...
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        (0, books_validation_1.validateBook)(req.body);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
    const { title, datePublished, description, pageCount, genre, publisher } = req.body;
    const newBook = new books_model_1.Book({
        title,
        datePublished,
        description,
        pageCount,
        genre,
        publisher,
        userId,
    });
    yield newBook.save();
    res.status(201).json({ message: 'Book created successfully.' });
});
exports.createBook = createBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, books_validation_1.validateBook)(req.body);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
    const { title, datePublished, description, pageCount, genre, publisher } = req.body;
    const book = yield books_model_1.Book.findByIdAndUpdate(req.params.id, {
        title,
        datePublished,
        description,
        pageCount,
        genre,
        publisher,
    });
    if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).json({ message: 'Book updated successfully.' });
});
exports.updateBook = updateBook;
// ...
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'Invalid bookId.' });
    }
    const deletedBook = yield books_model_1.Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
        return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).json({ message: 'Book deleted successfully.' });
});
exports.deleteBook = deleteBook;
