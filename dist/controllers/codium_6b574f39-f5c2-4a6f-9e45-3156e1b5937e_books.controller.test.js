"use strict";
// import { Request, Response } from 'express';
// import jwt, { JsonWebTokenError } from 'jsonwebtoken';
// // import mongoose from 'mongoose';
// import { Book, IBookDocument } from '../models/books.model';
// import { BookInput, validateBook } from '../schema/books.validation';
// // import { ZodError } from 'zod';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookByUserId = exports.updateBookByUserId = exports.createBook = exports.getBooksForUser = exports.getBookById = exports.getAllBooks = exports.verifyTokenMiddleware = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const books_model_1 = require("../models/books.model");
const books_validation_1 = require("../schema/books.validation");
// Middleware for token verification
const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, 'your-secret-key');
        const userId = decodedToken._id;
        if (!userId) {
            throw new Error('User ID not found in the token');
        }
        // Attach the user ID to the request for later use
        req.userId = userId;
        next();
    }
    catch (jwtError) {
        console.error('JWT Verification Error:', jwtError.message);
        if (jwtError instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token: ' + jwtError.message });
        }
        else {
            res.status(401).json({ error: 'JWT verification failed' });
        }
    }
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const limit = 5; // You can adjust this limit as needed
        const skip = (page - 1) * limit;
        const books = yield books_model_1.Book.find().skip(skip).limit(limit);
        res.status(200).json({ books });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    try {
        const book = yield books_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
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
        const userBooks = yield books_model_1.Book.find({ user: userId });
        res.status(200).json({ userBooks });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getBooksForUser = getBooksForUser;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, datePublished, description, pageCount, genre, publisher } = (0, books_validation_1.validateBook)(req.body);
        const userId = req.userId; // Retrieve the user ID from the request
        const newBookData = {
            title,
            datePublished,
            description,
            pageCount,
            genre,
            publisher,
            user: userId,
        };
        const newBook = yield books_model_1.Book.create(newBookData);
        res.status(201).json({ message: 'Book created successfully', book: newBook });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createBook = createBook;
const updateBookByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    const { title, datePublished, description, pageCount, genre, publisher } = (0, books_validation_1.validateBook)(req.body);
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, 'your-secret-key');
        const loggedInUserId = decodedToken._id || decodedToken.sub;
        const updatedBook = yield books_model_1.Book.findOneAndUpdate({ _id: bookId, user: userId }, {
            title,
            datePublished,
            description,
            pageCount,
            genre,
            publisher,
        }, { new: true });
        if (!updatedBook) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        if (userId !== loggedInUserId) {
            res.status(403).json({ error: 'You are not authorized to update this book' });
            return;
        }
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateBookByUserId = updateBookByUserId;
const deleteBookByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const deletedBook = yield books_model_1.Book.findOneAndDelete({ _id: bookId, user: userId });
        if (!deletedBook) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, 'your-secret-key');
        const loggedInUserId = decodedToken._id || decodedToken.sub;
        if (userId !== loggedInUserId) {
            res.status(403).json({ error: 'You are not authorized to delete this book' });
            return;
        }
        res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteBookByUserId = deleteBookByUserId;
// Generated by CodiumAI
describe('createBook', () => {
    // Should handle and throw any errors thrown during user ID retrieval from the request
    it('should handle and throw any errors thrown during user ID retrieval from the request', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: {
                title: 'Test Book',
                datePublished: '2022-01-01',
                description: 'This is a test book',
                pageCount: 200,
                genre: 'Fiction',
                publisher: 'Test Publisher',
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        Object.defineProperty(req, 'userId', {
            get() {
                throw new Error('User ID retrieval error');
            },
        });
        yield (0, exports.createBook)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error',
        });
    }));
});
