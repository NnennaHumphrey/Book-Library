"use strict";
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
exports.Book = void 0;
// Import necessary modules
const mongoose_1 = __importStar(require("mongoose"));
const books_validation_1 = require("../schema/books.validation");
// Define book schema
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    datePublished: { type: String, required: [true, 'Date published is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    pageCount: { type: Number, required: [true, 'Page count is required'] },
    genre: { type: String, required: [true, 'Genre is required'] },
    publisher: { type: String, required: [true, 'Publisher is required'] },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }, // Reference to User ID
}, { timestamps: true });
// Method to validate and save book data before creating or updating
bookSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            title: this.title,
            datePublished: this.datePublished,
            description: this.description,
            pageCount: this.pageCount,
            genre: this.genre,
            publisher: this.publisher,
        };
        // Validate against custom book validation
        const isValid = (0, books_validation_1.validateBook)(data);
        if (!isValid) {
            throw new Error('Book validation failed');
        }
        next();
    });
});
// Create Book model
const Book = mongoose_1.default.model('Book', bookSchema);
exports.Book = Book;
