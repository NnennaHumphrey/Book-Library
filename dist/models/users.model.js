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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const users_validation_1 = require("../schema/users.validation");
const books_validation_1 = require("../schema/books.validation");
const userMongooseSchema = new mongoose_1.Schema({
    authorName: {
        type: String,
        required: [true, 'Author name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    books: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Book' }], // Reference to Book
}, { timestamps: true });
// Method to validate and save book data for a user
userMongooseSchema.methods.addBook = function (bookData) {
    return __awaiter(this, void 0, void 0, function* () {
        const validatedBook = (0, books_validation_1.validateBook)(bookData);
        if (!validatedBook) {
            throw new Error('Book validation failed');
        }
        const newBook = Object.assign({}, validatedBook);
        this.books.push(newBook);
        yield this.save();
    });
};
// Method to validate and save user data
userMongooseSchema.methods.validateAndSave = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = {
            authorName: this.authorName,
            email: this.email,
            password: this.password,
            phoneNumber: this.phoneNumber,
            confirmPassword: this.confirmPassword,
        };
        // Validate against Zod schema
        const isValid = (0, users_validation_1.validateUser)(userData);
        if (!isValid) {
            throw new Error('User validation failed');
        }
        // Save the user data
        return this.save();
    });
};
const User = mongoose_1.default.model('User', userMongooseSchema);
exports.User = User;
